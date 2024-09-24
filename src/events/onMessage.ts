import { Client, Message, TextChannel } from "discord.js";
import MarkovChain from "markov-strings";
import SpeakChannel from "../classes/SpeakChannel.js";
import chainConfig from "../config/chainConfig.js";
import { ReplyCondition } from "../enums/ReplyCondition.js";
import { default as channelStore } from "../stores/guildStore.js";
import { CacheConfig } from "../types/CacheConfig.js";
import replyConditionMet from "./utils/onMessage/replyConditionMet.js";

export default async function onMessage(
  message: Message,
  bot: Client,
  cacheConfig: CacheConfig,
) {
  if (!message.guildId || !(message.channel instanceof TextChannel)) return;

  let storeChannel = channelStore.get(message.channelId);
  if (!channelStore.get(message.channelId)) {
    const speakChannel = new SpeakChannel(message.channel, cacheConfig);
    storeChannel = speakChannel;
    channelStore.set(message.channelId, storeChannel);
  }
  if (!storeChannel) {
    console.error(
      `❌ Failed to add channel (ID: ${message.channelId}) to store`,
    );
    return;
  }
  storeChannel.cacheMessage(message);

  const replyCondition = replyConditionMet(message, bot);
  if (replyCondition === ReplyCondition.None) return;

  if (replyCondition === ReplyCondition.Mention)
    void message.channel.sendTyping();
  storeChannel.writingMessage = true;
  storeChannel.resetChance();

  let messages;
  if (replyCondition === ReplyCondition.Random) {
    messages = await storeChannel.getMessages(cacheConfig.maxCached);
  } else {
    messages = await storeChannel.getMessages(cacheConfig.cacheOnEveryMessage);
  }

  const chain = new MarkovChain.default({ stateSize: 2 });
  chain.addData(messages);

  let generatedMessage;
  try {
    generatedMessage = chain.generate(chainConfig);
  } catch {
    await message.channel.send("I'm at a loss for words. Literally.");
  }
  if (generatedMessage) await message.channel.send(generatedMessage.string);

  storeChannel.writingMessage = false;
}
