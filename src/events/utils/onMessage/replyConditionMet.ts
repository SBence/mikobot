import { Client, Message } from "discord.js";
import guildStore from "../../../stores/guildStore.js";
import { ReplyCondition } from "../../../enums/ReplyCondition.js";

export default function replyConditionMet(message: Message, bot: Client) {
  if (
    !bot.user ||
    !message.guildId ||
    guildStore[message.guildId][message.channelId].writingMessage
  )
    return ReplyCondition.None;

  if (message.mentions.has(bot.user)) return ReplyCondition.Mention;
  if (
    !Math.floor(
      (Math.random() * 1000) /
        guildStore[message.guildId][message.channelId].chance,
    )
  )
    return ReplyCondition.Random;

  return ReplyCondition.None;
}
