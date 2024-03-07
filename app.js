"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
const openai_1 = require("openai"); // Corrected import
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const slackClient = new web_api_1.WebClient(process.env.SLACK_BOT_TOKEN);
const openAI = new openai_1.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const fetchChannelMessages = (channelId, oldest, latest) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const response = yield slackClient.conversations.history({
        channel: channelId,
        oldest,
        latest,
        limit: 1000,
      });
      return (_a = response.messages) === null || _a === void 0 ? void 0 : _a.map((msg) => msg.text).join("\n");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });
const summarizeText = (text) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
      const response = yield openAI.chat.completions.create({
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
      return (_d = (_c = (_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message.content) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  });
const sendDM = (userId, text) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
      const openConvo = yield slackClient.conversations.open({ users: userId });
      const channelId = (_e = openConvo.channel) === null || _e === void 0 ? void 0 : _e.id;
      if (channelId) {
        yield slackClient.chat.postMessage({
          channel: channelId,
          text,
        });
      } else {
        console.error("Failed to open a conversation");
      }
    } catch (error) {
      console.error("Error sending DM:", error);
    }
  });
const main = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const channelId = "C1234567890"; // Replace with your Channel ID
    const userId = "U1234567890"; // Replace with the User ID to receive the summary
    const oldest = "1612454400"; // Start of time range (epoch time)
    const latest = "1612540800"; // End of time range (epoch time)
    const messages = yield fetchChannelMessages(channelId, oldest, latest);
    if (messages) {
      const summary = yield summarizeText(messages);
      yield sendDM(userId, `Here's the summary:\n${summary}`);
    }
  });
main().catch(console.error);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/slack/summary", async (req, res) => {
  const userId = req.body.user_id;
  const commandText = req.body.text;

  try {
    await main(commandText, userId);
    res.send("Summary request received, check your DMs soon!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process your summary request.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
