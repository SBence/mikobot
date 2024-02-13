import SpeakChannel from "./classes/SpeakChannel.js";
import onMessage from "./events/onMessage.js";
import updatePresence from "./events/updatePresence.js";
import guildStore from "./stores/guildStore.js";
import { ChannelType, Client, Events, PermissionsBitField } from "discord.js";
import cacheConfig from "./config/cacheConfig.json" with { type: "json" };

export default function registerEventHandlers(client: Client) {
  client.once(Events.ClientReady, async () => {
    if (client.user) {
      console.log(`✅ Logged in as ${client.user.tag}`);
    } else {
      console.log("✅ Logged in");
    }
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
      !client.user ||
      !message.guild ||
      !message.guildId ||
      message.channel.type === ChannelType.DM
    )
      return;

    const botPermissionsInChannel = message.channel.permissionsFor(client.user);
    if (!botPermissionsInChannel) return;

    if (
      message.channel.type !== ChannelType.GuildText ||
      message.author.bot ||
      !message.guild.available ||
      !message.content ||
      !botPermissionsInChannel.has(PermissionsBitField.Flags.SendMessages)
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
