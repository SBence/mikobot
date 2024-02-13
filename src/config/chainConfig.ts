import { MarkovGenerateOptions, MarkovResult } from "markov-strings";

const chainConfig: MarkovGenerateOptions = {
  maxTries: 4096,
  filter: (result: MarkovResult) => {
    return (
      result.score >= 7 &&
      !result.string.includes("@") &&
      result.string.length <= 2000 &&
      !result.string.includes("||") &&
      !result.string.includes("http")
    );
  },
};

export default chainConfig;
