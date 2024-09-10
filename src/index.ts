import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import registerEventHandlers from "./registerEventHandlers.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

registerEventHandlers(client);

console.log("⏳ Logging in...");

try {
  await client.login(process.env.DISCORD_TOKEN);
} catch (e) {
  console.error(
    '❌ Login error\nMake sure that there is a "DISCORD_TOKEN" entry with the token of the bot application in the ".env" file.\nTo check the applications in your Discord account go to the following page:\nhttps://discord.com/developers/applications',
  );
}
