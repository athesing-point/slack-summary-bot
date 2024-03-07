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

const summarizeText = async (text: string) => {
  try {
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo", // Correct model identifier
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Summarize this conversation:\n\n${text}`,
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

const main = async () => {
  const channelId = "C1234567890"; // Replace with your Channel ID
  const userId = "U1234567890"; // Replace with the User ID to receive the summary
  const oldest = "1612454400"; // Start of time range (epoch time)
  const latest = "1612540800"; // End of time range (epoch time)

  const messages = await fetchChannelMessages(channelId, oldest, latest);
  if (messages) {
    const summary = await summarizeText(messages);
    await sendDM(userId, `Here's the summary:\n${summary}`);
  }
};

main().catch(console.error);
