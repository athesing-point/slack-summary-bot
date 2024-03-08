import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { WebClient } from "@slack/web-api"; // Import WebClient from Slack Web API for Slack operations
import { OpenAI } from "openai"; // Import OpenAI for AI operations
import * as dotenv from "dotenv"; // Import dotenv for environment variable management
import path from "path";
import axios from "axios"; // Import axios for making HTTP requests

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
    console.log(`Fetching messages for channel ${channelId} from ${oldest} to ${latest}`);
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
    console.log(`Summarizing text with detail level ${detailLevel}`);
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
    console.log(`Sending DM to user ${userId}`);
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
// Hardcoded channel IDs mapping with an index signature
const channelIds: { [key: string]: string } = {
  "marketing-design-team": "C06KSEU6YAC",
  "website-pdc": "C03U4Q0T23W",
  "seo-and-content": "C045Q1W6AH2",
};

// Function to find a channel ID by its name
const findChannelIdByName = async (channelName: string): Promise<string | undefined> => {
  console.log(`Finding channel ID for "${channelName}"`);
  // Normalize channel name by removing leading '#'
  const cleanChannelName = channelName.replace(/^#/, "");

  // Return the channel ID from the hardcoded mapping
  return channelIds[cleanChannelName];
};

// Define the route for your Slack slash command
app.post("/slack/summary", async (req: Request, res: Response) => {
  console.log("Received Slack command:", req.body);
  // Extract the response_url from the request body
  const responseUrl = req.body.response_url;

  // Immediately acknowledge the Slack command
  res.status(200).send("Processing your request. Please wait...");

  // Then, process the request asynchronously
  (async () => {
    // Assuming the user ID is part of the request body, typically under `user_id` for Slack commands
    const userId = req.body.user_id;

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
      const summary = await summarizeText(messages, detailLevel as "low" | "high");
      console.log(`Generated summary:`, summary);
      await sendDM(userId, `Here's the summary:\n${summary}`);
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
