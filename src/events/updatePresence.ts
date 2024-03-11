import { ActivityType, Client } from "discord.js";
import plural from "./utils/updatePresence/plural.js";

const activityTypes = [
  "Playing",
  "Streaming",
  "Listening",
  "Watching",
  "Custom",
  "Competing",
];

export default async function updatePresence(client: Client) {
  if (!client.user) {
    console.warn("⚠️ Could not set presence");
    return;
  }
  const guildCount = (await client.guilds.fetch()).toJSON().length;
  const presence = client.user.setActivity(plural(guildCount, "server"), {
    type: ActivityType.Watching,
  });
  console.log(
    `ℹ️ Activity set to: ${activityTypes[presence.activities[0].type]} ${presence.activities[0].name}`,
  );
}
