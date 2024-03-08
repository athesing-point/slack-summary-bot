//WIP //WIP //WIP //WIP
import { readFileSync } from 'fs';

interface SlackUser {
    id: string;
    name: string;
}

interface UserMappings {
    members: SlackUser[];
}

// Load and parse the JSON, then convert to a Map for easy lookup
function loadUserMappings(filePath: string): Map<string, string> {
    const rawData = readFileSync(filePath, 'utf8');
    const data: UserMappings = JSON.parse(rawData);
    const userMap = new Map<string, string>();
    data.members.forEach(user => {
        userMap.set(user.id, user.name);
    });
    return userMap;
}

// Replace Slack user IDs in the summary with their corresponding names
function replaceUserIdsWithUsernames(summary: string, userMap: Map<string, string>): string {
    return summary.replace(/<@([A-Z0-9]+)>/g, (match, userId) => {
        return userMap.has(userId) ? `@${userMap.get(userId)}` : match;
    });
}

// Example usage
const userMap = loadUserMappings('path/to/slack-users-clean.json');
const summary = 'This is a message from <@USLACKBOT> and <@U02ASPNS1>.';

const updatedSummary = replaceUserIdsWithUsernames(summary, userMap);
console.log(updatedSummary);
