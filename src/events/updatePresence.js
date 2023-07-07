import plural from "./utils/updatePresence/plural.js";

export default async function updatePresence(client) {
  const guildCount = (await client.guilds.fetch()).toJSON().length;
  const presence = client.user.setActivity(plural(guildCount, "server"), {
    type: "WATCHING",
  });

  console.log(
    `ℹ️ Activity set to ${presence.activities[0].type} ${presence.activities[0].name}`,
  );
}
