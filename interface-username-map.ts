//WIP //WIP //WIP //WIP

interface User {
    id: string;
    name: string;
}
interface UserMapping {
    members: User[];
}

import { readFileSync } from 'fs';

// Reads the JSON file and returns a mapping from user IDs to usernames
function readUserMappings(filePath: string): Map<string, string> {
    const rawData = readFileSync(filePath, 'utf8');
    const data: UserMapping = JSON.parse(rawData);
    const userMap = new Map<string, string>();

    for (const user of data.members) {
        userMap.set(user.id, user.name);
    }
    return userMap;
}

// Replaces all occurrences of user IDs in the summary with their corresponding usernames
function replaceUserIdsWithUsernames(summary: string, userMap: Map<string, string>): string {
    return summary.replace(/<@(U[A-Z0-9]+)>/g, (match, userId) => {
        const username = userMap.get(userId);
        return username ? `@${username}` : match;
    });
}

// Example usage
try {
    const userMap = readUserMappings('slack-users-clean.json');
    const summary = 'This is a summary mentioning <@USLACKBOT> and <@U02ASPNS1>.';

    const updatedSummary = replaceUserIdsWithUsernames(summary, userMap);
    console.log(updatedSummary);
} catch (error) {
    console.error("Failed to process summary:", error);
}
