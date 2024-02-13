export default function plural(number: number, word: string) {
  return `${number} ${word}${number !== 1 ? "s" : ""}`;
}
