import SpeakChannel from "../classes/SpeakChannel.js";

type GuildStore = Record<string, Record<string, SpeakChannel>>;

const guildStore: GuildStore = {};
export default guildStore;
