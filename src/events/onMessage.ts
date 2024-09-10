import { Client, Message, PartialGroupDMChannel } from "discord.js";
import MarkovChain from "markov-strings";
import chainConfig from "../config/chainConfig.js";
import { ReplyCondition } from "../enums/ReplyCondition.js";
import guildStore from "../stores/guildStore.js";
import { CacheConfig } from "../types/CacheConfig.js";
import replyConditionMet from "./utils/onMessage/replyConditionMet.js";

export default async function onMessage(
  message: Message,
  bot: Client,
  cacheConfig: CacheConfig,
) {
  if (!message.guildId || message.channel instanceof PartialGroupDMChannel)
    return;

  guildStore[message.guildId][message.channelId].cacheMessage(message);

  const replyCondition = replyConditionMet(message, bot);
  if (replyCondition === ReplyCondition.None) return;

  if (replyCondition === ReplyCondition.Mention)
    void message.channel.sendTyping();
  guildStore[message.guildId][message.channelId].writingMessage = true;
  guildStore[message.guildId][message.channelId].resetChance();

  let messages;
  if (replyCondition === ReplyCondition.Random) {
    messages = await guildStore[message.guildId][message.channelId].getMessages(
      cacheConfig.maxCached,
    );
  } else {
    messages = await guildStore[message.guildId][message.channelId].getMessages(
      cacheConfig.cacheOnEveryMessage,
    );
  }

  const chain = new MarkovChain.default({ stateSize: 2 });
  chain.addData(messages);

  let generatedMessage;
  try {
    generatedMessage = chain.generate(chainConfig);
  } catch (error) {
    await message.channel.send("I'm at a loss for words. Literally.");
  }
  if (generatedMessage) await message.channel.send(generatedMessage.string);

  guildStore[message.guildId][message.channelId].writingMessage = false;
}
