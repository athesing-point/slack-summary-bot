//WIP //WIP //WIP //WIP
import { readFileSync } from 'fs';

interface UserMapping {
    members: {
        [userId: string]: string; // Maps user ID to username
    };
}

// Function to read user mappings from the JSON file
function readUserMappings(filePath: string): UserMapping {
    try {
        const rawData = readFileSync(filePath, 'utf8');
        const data: UserMapping = JSON.parse(rawData);
        return data;
    } catch (error) {
        console.error("Error reading user mappings:", error);
        throw error; // Re-throw the error to handle it outside
    }
}

// Function to replace user IDs with usernames in a summary
function replaceUserIdsWithUsernames(summary: string, userMappings: UserMapping): string {
    return summary.replace(/<@(U[A-Z0-9]+)>/g, (match, userId) => {
        const username = userMappings.members[userId];
        return username ? `@"${username}"` : match;
    });
}

// Example usage
const filePath = 'slack-users-clean.json'; // Path to your JSON file
try {
    const userMappings = readUserMappings(filePath);
    const summary = 'This is a summary mentioning <U04UB4ZBKBQ> and <U02EG90CQU9>.';
    const updatedSummary = replaceUserIdsWithUsernames(summary, userMappings);
    console.log(updatedSummary);
} catch (error) {
    console.error("Failed to process summary:", error);
}
