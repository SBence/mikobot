import SpeakChannel from "./classes/SpeakChannel.js";
import onMessage from "./events/onMessage.js";
import updatePresence from "./events/updatePresence.js";
import guildStore from "./stores/guildStore.js";
import loadJSON from "./events/utils/loadJSON.js";
const cacheConfig = loadJSON("config/cacheConfig.json");

export default function registerEventHandlers(client) {
  client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await updatePresence(client);
  });

  client.on("guildCreate", async (guild) => {
    guildStore[guild.id] = {};
    await updatePresence(client);
  });

  client.on("guildDelete", async (guild) => {
    delete guildStore[guild.id];
    await updatePresence(client);
  });

  client.on("messageCreate", async (message) => {
    if (
      message.channel.type !== "GUILD_TEXT" ||
      message.author.bot ||
      !message.guild.available ||
      !message.channel.permissionsFor(client.user).has("SEND_MESSAGES")
    )
      return;

    if (!guildStore[message.guildId]) {
      guildStore[message.guildId] = {};
    }

    if (!guildStore[message.guildId][message.channelId]) {
      guildStore[message.guildId][message.channelId] = new SpeakChannel(
        message.channel,
        cacheConfig,
      );
    }

    await onMessage(message, client, cacheConfig);
  });
}
