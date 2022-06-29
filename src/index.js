import "dotenv/config";
import { Client, Intents } from "discord.js";
import registerEventHandlers from "./registerEventHandlers.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

registerEventHandlers(client);

console.log("⏳ Logging in...");

try {
  await client.login(process.env.DISCORD_TOKEN);
} catch (e) {
  if (e["code"] === "TOKEN_INVALID") {
    console.error(
      '⚠️ Invalid token\nMake sure that there is a "DISCORD_TOKEN" entry with the token of the bot application in the ".env" file.\nTo check the applications in your Discord account go to the following page:\nhttps://discord.com/developers/applications'
    );
  } else {
    console.error("⚠️ Login error");
  }
}
