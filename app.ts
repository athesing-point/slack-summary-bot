import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { WebClient } from "@slack/web-api"; // Import WebClient from Slack Web API for Slack operations
import { OpenAI } from "openai"; // Import OpenAI for AI operations
import * as dotenv from "dotenv"; // Import dotenv for environment variable management
import path from "path";
import axios from "axios"; // Import axios for making HTTP requests
import { filterMessages } from "./interface"; // Import filterMessages for message sanitization
import { replaceUserIdsWithUsernames, loadUserMappings } from "./interface-username-map";

dotenv.config(); // Load environment variables from .env file

// Initialize Slack WebClient with bot token from environment variables
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
// Initialize OpenAI client with API key from environment variables
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new express application instance
const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Load user mappings from a JSON file
interface User {
  display_name: string;
}
const userMap: Map<string, User> = new Map(Array.from(loadUserMappings(path.join(__dirname, "slack-users-clean.json"))).map(([key, value]) => [key, { display_name: value }]));

// Function to fetch messages from a Slack channel within a given time range
const fetchChannelMessages = async (channelId: string, oldest: string, latest: string) => {
  try {
    console.log(`Fetching messages for channel ${channelId} from ${oldest} to ${latest}`);
    // Fetch conversation history using Slack API
    const response = await slackClient.conversations.history({
      channel: channelId,
      oldest,
      latest,
      limit: 1000, // Set message fetch limit
    });

    // Assuming response.messages is an array of message objects
    const detailedMessages = response.messages
      ?.map((msg) => {
        // Extract the user ID from the message sender
        const userId = msg.user; // Adjust based on actual structure
        let username = "Summary Ship / Unknown"; // Default username
        if (userId) {
          const userObject = userMap.get(userId); // Attempt to retrieve the user object
          if (userObject) {
            username = userObject.display_name; // Use the display name if available
          }
        }
        // Prepend the username to the message text
        return `${username}: ${msg.text}`;
      })
      .join("\n");
    return detailedMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Function to summarize text using OpenAI with a specified detail level
const summarizeText = async (text: string, detailLevel: "low" | "high"): Promise<string> => {
  try {
    // Determine prompt based on detail level
    const prompt =
      detailLevel === "low"
        ? "Keep this summary concise and to the point:"
        : "Create a summary that encapsulates the essence of the message, highlighting the primary points and conclusions. Utilize bullet points or lists to organize the information clearly. Pay special attention to maintaining the tone and intent of the original message:";

    // Create chat completion with OpenAI using the determined prompt and input text
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant who creates succinct summaries of Slack channel messages. I will provide the messages in json format, and you should write the summary in Slack's unique markdown style. Each message will include a unix time stamp (ts) which you can use to organize your summary chronologically if it spans more than one week.",
        },
        {
          role: "user",
          content: `${prompt}\n\n${text}`,
        },
      ],
    });
    // Return the summary, trim whitespace, return empty string if no content
    return response.choices[0]?.message.content?.trim() ?? "";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return ""; // Return an empty string in case of an error
  }
};

// Function to send a direct message to a user on Slack
const sendDM = async (userId: string, text: string) => {
  try {
    console.log(`Sending DM to user ${userId}`);
    // Open a conversation with the specified user
    const openConvo = await slackClient.conversations.open({ users: userId });
    const channelId = openConvo.channel?.id; // Extract channel ID from the conversation
    if (channelId) {
      // Replace ### headings with bolded text
      const formattedText = text.replace(/###\s*(.*)/g, "*$1*");
      // Replace ** around a word with single * (Markdown bold to italic conversion)
      const markdownAdjustedText = formattedText.replace(/\*\*(\S(.*?\S)?)\*\*/g, "*$1*");
      // Post the message to the opened conversation channel
      await slackClient.chat.postMessage({
        channel: channelId,
        text: markdownAdjustedText, // Use the markdown adjusted text here
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: markdownAdjustedText, // Use the markdown adjusted text here
            },
          },
          // Add more blocks as needed for different sections of the summary
        ],
      });
    } else {
      console.error("Failed to open a conversation");
    }
  } catch (error) {
    console.error("Error sending DM:", error);
  }
};

// Function to find a channel ID by its name
// Hardcoded channel IDs mapping with an index signature
const channelIds: { [key: string]: string } = {
  "marketing-design-team": "C06KSEU6YAC",
  "website-pdc": "C03U4Q0T23W",
  "seo-and-content": "C045Q1W6AH2",
  "hackathon-lazy-slack-club": "C06NEARE0M9",
};
// Hardcoded user whitelist for security
// const userIdWhitelist = new Set(["U01HFBY3XGX", "U042J4T4B", "U0413GXHSHW", "U02PC6Z1S", "U02AULEAG", "U052D6423P0", "U0ES3F3U3", "U04JBJG1WNS", "U57MPQ8HY", "U04Q35M65KN", "U02EG90CQU9", "U04UB4ZBKBQ", "U03BJ5BDABY"]);
const userIdWhitelist = new Set<string>(["U01HFBY3XGX", "U042J4T4B", "U0413GXHSHW", "U02PC6Z1S", "U02AULEAG", "U052D6423P0", "U0ES3F3U3", "U04JBJG1WNS", "U57MPQ8HY", "U04Q35M65KN", "U02EG90CQU9", "U04UB4ZBKBQ"]);

// Function to find a channel ID by its name
const findChannelIdByName = async (channelName: string): Promise<string | undefined> => {
  console.log(`Finding channel ID for "${channelName}"`);
  // Normalize channel name by removing leading '#' if present
  const cleanChannelName = channelName.startsWith("#") ? channelName.substring(1) : channelName;

  // Return the channel ID from the hardcoded mapping
  return channelIds[cleanChannelName];
};

// Define the route for your Slack slash command
app.post("/slack/summary", async (req: Request, res: Response) => {
  console.log("Received Slack command:", req.body);
  // Extract the response_url and user_id from the request body
  const responseUrl = req.body.response_url;
  const userId = req.body.user_id;
  console.log("User ID:", userId);

  // Check if the user is in the whitelist
  if (!userIdWhitelist.has(userId)) {
    // User is not in the whitelist, send an error message
    console.error(`User ${userId} is not authorized to use this command.`);
    if (responseUrl) {
      // Send a message to the response_url indicating the user is not authorized
      await axios.post(responseUrl, {
        replace_original: "true",
        text: `Sorry, you are not authorized to use this command.`,
      });
    }
    return res.status(403).send("Sorry, you are not authorized to use this command.");
  }

  // Immediately acknowledge the Slack command
  res.status(200).send("Processing your request. Please wait...");

  // Then, process the request asynchronously
  (async () => {
    if (!userId) {
      res.json({
        response_type: "ephemeral",
        text: "Could not identify the user ID.",
      });
      return;
    }

    // Trim the text and split by one or more spaces
    const parts = req.body.text.trim().split(/\s+/);
    if (parts.length < 3) {
      res.json({
        response_type: "ephemeral",
        text: "Please provide the command in the format: /summary [detailLevel] [channelName] [days]",
      });
      return;
    }
    const [detailLevel, channelName, daysInput] = parts;

    // Resolve channel name to channel ID
    const channelId = await findChannelIdByName(channelName);
    console.log(`Channel ID for "${channelName}":`, channelId);
    if (!channelId) {
      console.error(`Failed to find channel: ${channelName}`);
      return;
    }

    // Calculate time range for message fetching
    const days = parseInt(daysInput.replace(/[^\d]/g, ""), 10);
    const now = new Date();
    const oldestDate = new Date(now.setDate(now.getDate() - days));
    const oldest = Math.floor(oldestDate.getTime() / 1000).toString();
    const latest = Math.floor(Date.now() / 1000).toString();

    // Fetch messages, summarize, and send DM with summary
    const messages = await fetchChannelMessages(channelId, oldest, latest);
    console.log(`Fetched messages for channel ${channelId}:`, messages);
    if (messages) {
      const originalData = { messages: [{ messages: messages.split("\n").map((message) => ({ text: message })) }] };
      const sanitizedMessages = filterMessages(originalData);
      // Convert userMap to the correct type before passing it to replaceUserIdsWithUsernames
      const userMapForReplacement = new Map<string, string>(Array.from(userMap.entries()).map(([id, user]) => [id, user.display_name]));
      // Apply user map to replace user IDs with usernames before summarization
      const messagesWithUsernames = replaceUserIdsWithUsernames(sanitizedMessages.map((msg) => msg.text).join("\n"), userMapForReplacement);
      console.log("Before summarization, messages with usernames:", messagesWithUsernames);
      const summary = await summarizeText(messagesWithUsernames, detailLevel as "low" | "high");
      // Assuming `summary` is your message summary or concatenated messages
      const userMapForSummary = new Map<string, string>(Array.from(userMap.entries()).map(([id, user]) => [id, user.display_name]));
      const updatedSummary = replaceUserIdsWithUsernames(summary, userMapForSummary);
      console.log(`Generated summary:`, updatedSummary);
      // Right before calling sendDM, ensure the summary header is constructed correctly
      const summaryHeader = `Here's the summary for #${channelName} over the last ${days} day(s):\n\n`;
      const finalSummary = summaryHeader + updatedSummary; // Ensure this concatenation happens once
      await sendDM(userId, finalSummary);
      console.log(`Sent DM to user ${userId}`);
      if (responseUrl) {
        // Send a message to the response_url indicating the summary has been sent
        await axios.post(responseUrl, {
          replace_original: "true",
          text: `Summary sent successfully to <@${userId}>.`,
        });
      }
    }
  })().catch(console.error);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://127.0.0.1:${port}`);
});
