import { Collection } from "discord.js";

export default class SpeakChannel {
  writingMessage = false;
  #chance = 1;
  #messageCache = [];

  constructor(discordChannel, cacheConfig) {
    this.discordChannel = discordChannel;
    this.cacheOnEveryMessage = cacheConfig.cacheOnEveryMessage;
    this.maxCached = cacheConfig.maxCached;
  }

  get messagesAsStringArray() {
    return this.#messageCache.map((message) => message.content);
  }

  get chance() {
    return this.#chance++;
  }

  resetChance() {
    this.#chance = 0;
  }

  cacheMessage(message) {
    if (!message.author.bot) this.#messageCache.push(message);
    this.#messageCache.splice(0, this.#messageCache.length - this.maxCached);
  }

  async getMessages(atLeast) {
    if (this.#messageCache.length < atLeast) {
      this.#messageCache.unshift(
        ...(await fetchMessages(
          this.discordChannel,
          atLeast - this.#messageCache.length,
          this.#messageCache[0].id
        ))
      );
    } else if (this.#messageCache.length < this.maxCached) {
      this.#messageCache.unshift(
        ...(await fetchMessages(
          this.discordChannel,
          Math.min(
            this.cacheOnEveryMessage,
            this.maxCached - this.#messageCache.length
          ),
          this.#messageCache[0].id
        ))
      );
    }
    return this.#messageCache
      .filter((msg) => !msg.author.bot)
      .map((msg) => msg.content);
  }
}

async function fetchMessages(channel, limit, before = undefined) {
  if (!channel) throw new Error(`Expected channel, got ${typeof channel}.`);
  if (limit <= 100) return channel.messages.fetch({ limit });

  let collection = new Collection();
  let lastId = before;
  const options = {};
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) options.before = lastId;

    const messages = await channel.messages.fetch(options);

    if (!messages.last()) break;

    collection = collection.concat(messages);
    lastId = messages.last().id;
  }

  return collection.toJSON();
}
