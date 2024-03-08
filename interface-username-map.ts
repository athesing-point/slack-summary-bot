//WIP //WIP //WIP //WIP
import { readFileSync } from "fs";

interface SlackUser {
  id: string;
  display_name: string;
}

interface UserMappings {
  members: SlackUser[];
}

// Load and parse the JSON, then convert to a Map for easy lookup
export function loadUserMappings(filePath: string): Map<string, string> {
  const rawData = readFileSync(filePath, "utf8");
  const data: UserMappings = JSON.parse(rawData);
  const userMap = new Map<string, string>();
  data.members.forEach((user) => {
    userMap.set(user.id, user.display_name);
  });
  console.log(userMap); // Added for debugging
  return userMap;
}

// Replace Slack user IDs in the summary with their corresponding names
export function replaceUserIdsWithUsernames(summary: string, userMap: Map<string, string>): string {
  return summary.replace(/<@([A-Z0-9]+)>/g, (match, userId) => {
    return userMap.has(userId) ? `@${userMap.get(userId)}` : match;
  });
}

// // Example usage
// const userMap = loadUserMappings("slack-users-clean.json");
// const summary = "This is a message from <@USLACKBOT> and <@U02ASPNS1>.";

// const updatedSummary = replaceUserIdsWithUsernames(summary, userMap);
// console.log(updatedSummary);
