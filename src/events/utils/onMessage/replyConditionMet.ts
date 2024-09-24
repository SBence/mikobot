import { Client, Message } from "discord.js";
import { ReplyCondition } from "../../../enums/ReplyCondition.js";
import { default as channelStore } from "../../../stores/guildStore.js";

export default function replyConditionMet(message: Message, bot: Client) {
  const storeChannel = channelStore.get(message.channelId);
  if (!storeChannel) return;

  if (!bot.user || !message.guildId || storeChannel.writingMessage)
    return ReplyCondition.None;

  if (message.mentions.has(bot.user)) return ReplyCondition.Mention;
  if (!Math.floor((Math.random() * 1000) / storeChannel.chance))
    return ReplyCondition.Random;

  return ReplyCondition.None;
}
