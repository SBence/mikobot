import {
  Collection,
  Message,
  Snowflake,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { CacheConfig } from "../types/CacheConfig.js";

interface FetchMessageOptions {
  limit: number | undefined;
  before: Snowflake | undefined;
}

export default class SpeakChannel {
  writingMessage = false;
  #chance = 1;
  #messageCache: Message[] = [];

  discordChannel;
  cacheOnEveryMessage;
  maxCached;

  constructor(discordChannel: TextChannel, cacheConfig: CacheConfig) {
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

  get guildId() {
    return this.discordChannel.guildId;
  }

  resetChance() {
    this.#chance = 0;
  }

  cacheMessage(message: Message) {
    this.#messageCache.push(message);
    this.#messageCache.splice(0, this.#messageCache.length - this.maxCached);
  }

  async getMessages(atLeast: number) {
    if (this.#messageCache.length < atLeast) {
      this.#messageCache.unshift(
        ...(await fetchMessages(
          this.discordChannel,
          atLeast - this.#messageCache.length,
          this.#messageCache[0].id,
        )),
      );
    } else if (this.#messageCache.length < this.maxCached) {
      this.#messageCache.unshift(
        ...(await fetchMessages(
          this.discordChannel,
          Math.min(
            this.cacheOnEveryMessage,
            this.maxCached - this.#messageCache.length,
          ),
          this.#messageCache[0].id,
        )),
      );
    }
    return (
      this.#messageCache
        // .filter((msg) => !msg.author.bot)
        .map((msg) => msg.content)
    );
  }
}

async function fetchMessages(
  channel: TextBasedChannel,
  limit: number,
  before: Snowflake | undefined,
) {
  if (limit <= 100)
    return (await channel.messages.fetch({ limit, before }))
      .filter((msg) => msg.content && !msg.author.bot)
      .toJSON();

  let collection = new Collection<string, Message>();
  let lastId = before;
  const options: FetchMessageOptions = { limit: undefined, before: undefined };
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) options.before = lastId;

    const messages = (await channel.messages.fetch(options)).filter(
      (msg) => msg.content && !msg.author.bot,
    );

    if (!messages.last()) break;

    collection = collection.concat(messages);
    lastId = messages.last()?.id;
  }

  return collection.toJSON();
}
