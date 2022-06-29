const chainConfig = {
  maxTries: 4096,
  filter: (result) => {
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
