import { Collection } from "discord.js";

export default async function fetchMessages(
  channel,
  limit,
  before = undefined,
) {
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
