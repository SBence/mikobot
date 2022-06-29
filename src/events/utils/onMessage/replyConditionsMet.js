import guildStore from "../../../stores/guildStore.js";

export default function replyConditionsMet(message, bot) {
  if (guildStore[message.guildId][message.channelId].writingMessage)
    return false;
  if (message.mentions.has(bot.user)) return "mention";
  if (
    !Math.floor(
      (Math.random() * 1000) /
        guildStore[message.guildId][message.channelId].chance
    )
  )
    return "random";
  return false;
}
