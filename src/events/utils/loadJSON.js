import { readFileSync } from "fs";

export default function loadJSON(filepath) {
  return JSON.parse(readFileSync(filepath));
}
