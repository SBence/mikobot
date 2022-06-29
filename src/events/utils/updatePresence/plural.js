export default function plural(number, word) {
  return `${number} ${word}${number !== 1 ? "s" : ""}`;
}
