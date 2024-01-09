import SpeakChannel from "./classes/SpeakChannel.js";
import onMessage from "./events/onMessage.js";
import updatePresence from "./events/updatePresence.js";
import guildStore from "./stores/guildStore.js";
import loadJSON from "./events/utils/loadJSON.js";
import { ChannelType, Events, PermissionsBitField } from "discord.js";
const cacheConfig = loadJSON("config/cacheConfig.json");

export default function registerEventHandlers(client) {
  client.once(Events.ClientReady, async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await updatePresence(client);
  });

  client.on(Events.GuildCreate, async (guild) => {
    guildStore[guild.id] = {};
    await updatePresence(client);
  });

  client.on(Events.GuildDelete, async (guild) => {
    delete guildStore[guild.id];
    await updatePresence(client);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (
      message.channel.type !== ChannelType.GuildText ||
      message.author.bot ||
      !message.guild.available ||
      !message.content ||
      !message.channel
        .permissionsFor(client.user)
        .has(PermissionsBitField.Flags.SendMessages)
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
