"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const web_api_1 = require("@slack/web-api"); // Import WebClient from Slack Web API for Slack operations
const openai_1 = require("openai"); // Import OpenAI for AI operations
const dotenv = __importStar(require("dotenv")); // Import dotenv for environment variable management
const path_1 = __importDefault(require("path"));
dotenv.config(); // Load environment variables from .env file
// Initialize Slack WebClient with bot token from environment variables
const slackClient = new web_api_1.WebClient(process.env.SLACK_BOT_TOKEN);
// Initialize OpenAI client with API key from environment variables
const openAI = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Create a new express application instance
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// Serve static files from the 'public' directory
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Function to fetch messages from a Slack channel within a given time range
const fetchChannelMessages = (channelId, oldest, latest) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(`Fetching messages for channel ${channelId} from ${oldest} to ${latest}`);
        // Fetch conversation history using Slack API
        const response = yield slackClient.conversations.history({
            channel: channelId,
            oldest,
            latest,
            limit: 1000, // Set message fetch limit
        });
        // Map and join messages to a single string, return null if no messages
        return (_a = response.messages) === null || _a === void 0 ? void 0 : _a.map((msg) => msg.text).join("\n");
    }
    catch (error) {
        console.error("Error fetching messages:", error);
    }
});
// Function to summarize text using OpenAI with a specified detail level
const summarizeText = (text, detailLevel) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        console.log(`Summarizing text with detail level ${detailLevel}`);
        // Determine prompt based on detail level
        const prompt = detailLevel === "low" ? "Provide a brief summary:" : "Provide a detailed summary:";
        // Create chat completion with OpenAI using the determined prompt and input text
        const response = yield openAI.chat.completions.create({
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
        return (_d = (_c = (_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message.content) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    }
    catch (error) {
        console.error("Error summarizing text:", error);
    }
});
// Function to send a direct message to a user on Slack
const sendDM = (userId, text) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        console.log(`Sending DM to user ${userId}`);
        // Open a conversation with the specified user
        const openConvo = yield slackClient.conversations.open({ users: userId });
        const channelId = (_e = openConvo.channel) === null || _e === void 0 ? void 0 : _e.id; // Extract channel ID from the conversation
        if (channelId) {
            // Post the message to the opened conversation channel
            yield slackClient.chat.postMessage({
                channel: channelId,
                text,
            });
        }
        else {
            console.error("Failed to open a conversation");
        }
    }
    catch (error) {
        console.error("Error sending DM:", error);
    }
});
// Function to find a channel ID by its name
// Hardcoded channel IDs mapping with an index signature
const channelIds = {
    "marketing-design-team": "C06KSEU6YAC",
    "website-pdc": "C03U4Q0T23W",
    "seo-and-content": "C045Q1W6AH2",
};
// Function to find a channel ID by its name
const findChannelIdByName = (channelName) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Finding channel ID for "${channelName}"`);
    // Normalize channel name by removing leading '#'
    const cleanChannelName = channelName.replace(/^#/, "");
    // Return the channel ID from the hardcoded mapping
    return channelIds[cleanChannelName];
});
// Define the route for your Slack slash command
app.post("/slack/summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received Slack command:", req.body);
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
    const channelId = yield findChannelIdByName(channelName);
    console.log(`Channel ID for "${channelName}":`, channelId);
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
    const messages = yield fetchChannelMessages(channelId, oldest, latest);
    console.log(`Fetched messages for channel ${channelId}:`, messages);
    if (messages) {
        const summary = yield summarizeText(messages, detailLevel);
        console.log(`Generated summary:`, summary);
        yield sendDM(userId, `Here's the summary:\n${summary}`);
        console.log(`Sent DM to user ${userId}`);
        res.json({
            response_type: "in_channel",
            text: `Summary sent successfully to <@${userId}>.`,
        });
    }
    else {
        res.json({
            response_type: "ephemeral",
            text: "No messages found in the specified time range.",
        });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
