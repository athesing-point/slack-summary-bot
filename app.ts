import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { WebClient } from "@slack/web-api"; // Import WebClient from Slack Web API for Slack operations
import { OpenAI } from "openai"; // Import OpenAI for AI operations
import * as dotenv from "dotenv"; // Import dotenv for environment variable management
import path from "path";

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

// Function to fetch messages from a Slack channel within a given time range
const fetchChannelMessages = async (channelId: string, oldest: string, latest: string) => {
  try {
    // Fetch conversation history using Slack API
    const response = await slackClient.conversations.history({
      channel: channelId,
      oldest,
      latest,
      limit: 1000, // Set message fetch limit
    });
    // Map and join messages to a single string, return null if no messages
    return response.messages?.map((msg) => msg.text).join("\n");
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Function to summarize text using OpenAI with a specified detail level
const summarizeText = async (text: string, detailLevel: "low" | "high") => {
  try {
    // Determine prompt based on detail level
    const prompt = detailLevel === "low" 
      ? "Keep this summary concise and to the point:" 
      : "Analyze the content to identify the main themes and key details. Create a summary that encapsulates the essence of the message, highlighting the primary points and conclusions. Utilize bullet points or lists to organize the information clearly. Pay special attention to maintaining the tone and intent of the original message:";

    // Create chat completion with OpenAI using the determined prompt and input text
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant whose purpose is to create succint summaries of Slack channel activity. I will provide the raw data in a json format, and you should write the summary in a markdown style.",
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
  }
};

// Function to send a direct message to a user on Slack
const sendDM = async (userId: string, text: string) => {
  try {
    // Open a conversation with the specified user
    const openConvo = await slackClient.conversations.open({ users: userId });
    const channelId = openConvo.channel?.id; // Extract channel ID from the conversation
    if (channelId) {
      // Post the message to the opened conversation channel
      await slackClient.chat.postMessage({
        channel: channelId,
        text,
      });
    } else {
      console.error("Failed to open a conversation");
    }
  } catch (error) {
    console.error("Error sending DM:", error);
  }
};

// Define a type for channel IDs with an index signature
type ChannelIds = {
  [key: string]: string;
};

// Function to find a channel ID by its name
const findChannelIdByName = async (channelName: string): Promise<string | undefined> => {
  // Hardcoded channel IDs with explicit type
  const channelIds: ChannelIds = {
    "marketing-design-team": "C06KSEU6YAC",
    "website-pdc": "C03U4Q0T23W",
  };

  // Normalize channel name by removing leading '#'
  const cleanChannelName = channelName.replace(/^#/, "");

  return channelIds[cleanChannelName];
};

// Define the route for your Slack slash command
app.post("/slack/summary", async (req: Request, res: Response) => {
  // Extract the text and user_id from the request body
  const { text, user_id } = req.body;

  // Split the text into parts
  const parts = text.split(" ");
  // Ensure there are at least three parts: detailLevel, channelName, and daysInput
  if (parts.length < 3) {
    res.json({
      response_type: "ephemeral",
      text: "Please provide the command in the format: /summary [low|high] #channel-name [number]d",
    });
    return;
  }

  // Assign the first part to detailLevel, the last part to daysInput, and join the rest as the channelName
  const detailLevel = parts[0];
  const daysInput = parts[parts.length - 1];
  const channelName = parts.slice(1, -1).join(" ");

  // Resolve channel name to channel ID
  const channelId = await findChannelIdByName(channelName);
  if (!channelId) {
    console.error(`Failed to find channel: ${channelName}`);
    res.json({
      response_type: "ephemeral",
      text: `Failed to find channel: ${channelName}`,
    });
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
  if (messages) {
    const summary = await summarizeText(messages, detailLevel as "low" | "high");
    await sendDM(user_id, `Here's the summary:\n${summary}`);
    res.json({
      response_type: "in_channel",
      text: `Summary sent successfully to <@${user_id}>.`,
    });
  } else {
    res.json({
      response_type: "ephemeral",
      text: "No messages found in the specified time range.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
