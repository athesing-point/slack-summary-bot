import { WebClient } from "@slack/web-api";
import { OpenAI } from "openai"; // Corrected import
import * as dotenv from "dotenv";

dotenv.config();

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchChannelMessages = async (channelId: string, oldest: string, latest: string) => {
  try {
    const response = await slackClient.conversations.history({
      channel: channelId,
      oldest,
      latest,
      limit: 1000,
    });
    return response.messages?.map((msg) => msg.text).join("\n");
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Add a new parameter to summarizeText to accept detail level
const summarizeText = async (text: string, detailLevel: "low" | "high") => {
  try {
    const prompt = detailLevel === "low" ? "Provide a brief summary:" : "Provide a detailed summary:";
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `${prompt}\n\n${text}`,
        },
      ],
    });
    return response.choices[0]?.message.content?.trim() ?? "";
  } catch (error) {
    console.error("Error summarizing text:", error);
  }
};

const sendDM = async (userId: string, text: string) => {
  try {
    const openConvo = await slackClient.conversations.open({ users: userId });
    const channelId = openConvo.channel?.id;
    if (channelId) {
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

// Function to fetch all channels and return the one that matches the provided name
const findChannelIdByName = async (channelName: string): Promise<string | undefined> => {
  try {
    // Remove the '#' if it's included in the channelName argument
    const cleanChannelName = channelName.replace(/^#/, "");
    let cursor; // For pagination
    do {
      const response = await slackClient.conversations.list({
        exclude_archived: true,
        types: "public_channel,private_channel", // Adjust based on your needs
        cursor,
      });

      const foundChannel = response.channels?.find((channel) => channel.name === cleanChannelName);
      if (foundChannel) {
        return foundChannel.id;
      }

      cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    console.error("Channel not found");
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
};

// Modify the main function to include the logic for resolving channelName to channelId
const main = async (commandInput: string) => {
  // Example command input: "/summary low #general 2d"
  const [, detailLevel, channelName, daysInput] = commandInput.split(" ");

  // Resolve channelName to channelId
  const channelId = await findChannelIdByName(channelName);
  if (!channelId) {
    console.error(`Failed to find channel: ${channelName}`);
    return;
  }

  const userId = "U1234567890"; // Replace with the User ID to receive the summary

  const days = parseInt(daysInput.replace(/[^\d]/g, ""), 10);
  const now = new Date();
  const oldestDate = new Date(now.setDate(now.getDate() - days));
  const oldest = Math.floor(oldestDate.getTime() / 1000).toString();
  const latest = Math.floor(Date.now() / 1000).toString();

  const messages = await fetchChannelMessages(channelId, oldest, latest);
  if (messages) {
    const summary = await summarizeText(messages, detailLevel as "low" | "high");
    await sendDM(userId, `Here's the summary:\n${summary}`);
  }
};

main("/summary low #general 2d").catch(console.error);
