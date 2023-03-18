import { leven, SpellCheck } from "@nlpjs/similarity";
import fs from "fs";
import { NGrams } from "@nlpjs/utils";

// File book.txt should contain the text that contains the words to be learnt.
// In the example we used Pride and Prejudice from Project Gutenberg
export const spellCheckText = (text: string) => {
  const newText = text.split(" ");
  const lines = fs.readFileSync("./data/book.txt", "utf-8").split(/\r?\n/);
  const ngrams = new NGrams({ byWord: true });
  const freqs = ngrams.getNGramsFreqs(lines, 1);
  const spellCheck = new SpellCheck({ features: freqs });
  return spellCheck.check(newText).join(" ");
};

export function getDistance(a: string, b: string): number {
  return leven(a, b);
}
