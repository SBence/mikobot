import SpeakChannel from "../classes/SpeakChannel.js";

type ChannelStore = Map<string, SpeakChannel>;

const channelStore: ChannelStore = new Map();
export default channelStore;
