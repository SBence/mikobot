export default function plural(number: number, word: string) {
  return `${number.toString()} ${word}${number !== 1 ? "s" : ""}`;
}
