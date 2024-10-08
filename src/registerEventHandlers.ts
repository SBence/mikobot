import { ChannelType, Client, Events, PermissionsBitField } from "discord.js";
import cacheConfig from "./config/cacheConfig.json" with { type: "json" };
import onMessage from "./events/onMessage.js";
import updatePresence from "./events/updatePresence.js";
import channelStore from "./stores/guildStore.js";

export default function registerEventHandlers(client: Client) {
  client.once(Events.ClientReady, async () => {
    if (client.user) {
      console.log(`✅ Logged in as ${client.user.tag}`);
    } else {
      console.log("✅ Logged in");
    }
    await updatePresence(client);
  });

  client.on(Events.GuildCreate, async () => {
    await updatePresence(client);
  });

  client.on(Events.GuildDelete, async (guild) => {
    channelStore.forEach((storeChannel, channelId) => {
      if (storeChannel.guildId === guild.id) channelStore.delete(channelId);
    });
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

    try {
      await onMessage(message, client, cacheConfig);
    } catch (error) {
      console.log(error);
    }
  });
}
