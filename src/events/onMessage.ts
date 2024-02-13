import MarkovChain from "markov-strings";
import chainConfig from "../config/chainConfig.js";
import guildStore from "../stores/guildStore.js";
import replyConditionMet from "./utils/onMessage/replyConditionMet.js";
import { CacheConfig } from "../types/CacheConfig.js";
import { Client, Message } from "discord.js";
import { ReplyCondition } from "../enums/ReplyCondition.js";

export default async function onMessage(
  message: Message,
  bot: Client,
  cacheConfig: CacheConfig,
) {
  if (!message.guildId) return;

  guildStore[message.guildId][message.channelId].cacheMessage(message);

  const replyCondition = replyConditionMet(message, bot);
  if (ReplyCondition.None) return;

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
    await message.channel.send(generatedMessage.string);
  } catch (error) {
    console.error(error);
  } finally {
    guildStore[message.guildId][message.channelId].writingMessage = false;
  }
}
