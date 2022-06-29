import MarkovChain from "markov-strings";
import chainConfig from "../../config/chainConfig.js";
import guildStore from "../stores/guildStore.js";
import replyConditionsMet from "./utils/onMessage/replyConditionsMet.js";

export default async function onMessage(message, bot, cacheConfig) {
  guildStore[message.guildId][message.channelId].cacheMessage(message);

  const conditions = replyConditionsMet(message, bot);
  if (!conditions) return;

  if (conditions === "mention") message.channel.sendTyping();
  guildStore[message.guildId][message.channelId].writingMessage = true;
  guildStore[message.guildId][message.channelId].resetChance();

  let messages;
  if (conditions === "random") {
    messages = await guildStore[message.guildId][message.channelId].getMessages(
      cacheConfig.maxCached
    );
  } else {
    messages = await guildStore[message.guildId][message.channelId].getMessages(
      cacheConfig.cacheOnEveryMessage
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
