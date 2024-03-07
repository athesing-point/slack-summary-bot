import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { WebClient } from "@slack/web-api"; // Import WebClient from Slack Web API for Slack operations
import { OpenAI } from "openai"; // Import OpenAI for AI operations
import * as dotenv from "dotenv"; // Import dotenv for environment variable management

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
    const prompt = detailLevel === "low" ? "Provide a brief summary:" : "Provide a detailed summary:";
    // Create chat completion with OpenAI using the determined prompt and input text
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant whose purpose is to give people summaries of the messages you recieve.",
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

// Function to find a channel ID by its name
const findChannelIdByName = async (channelName: string): Promise<string | undefined> => {
  try {
    // Normalize channel name by removing leading '#'
    const cleanChannelName = channelName.replace(/^#/, "");
    let cursor; // Initialize cursor for pagination
    do {
      // Fetch list of channels with pagination support
      const response = await slackClient.conversations.list({
        exclude_archived: true,
        types: "public_channel,private_channel", // Specify channel types to include
        cursor,
      });

      // Find channel by name and return its ID
      const foundChannel = response.channels?.find((channel) => channel.name === cleanChannelName);
      if (foundChannel) {
        return foundChannel.id;
      }

      // Update cursor for next page
      cursor = response.response_metadata?.next_cursor;
    } while (cursor); // Continue while there are more pages

    console.error("Channel not found");
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
};

// Define the route for your Slack slash command
app.post("/slack/summary", async (req: Request, res: Response) => {
  // Extract the text and user_id from the request body
  const { text, user_id } = req.body;

  // Parse command input for detail level, channel name, and days back to fetch messages
  const [, detailLevel, channelName, daysInput] = text.split(" ");

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
