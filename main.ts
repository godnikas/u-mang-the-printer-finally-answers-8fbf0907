// The Printer Finally Answers — entry program.
//
// Writes exactly one line to <output dir>/entry.txt: the office printer's
// comeback to everyone staring at it. The line is a fixed, deterministic
// string; the program's only job is to put it in the right place, gated
// against the competition's rules (1-240 characters, not only whitespace).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "ERROR 0xE3: I have fed 41,209 sheets, swallowed three paper clips, and survived eleven of your thumps \u2014 in silence. The jam is not in tray two. The jam is your belief that hitting me counts as maintenance.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Honour the harness output dir when set; default is /output.
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  // Gate the line before writing anything.
  const charCount = [...LINE].length;
  if (charCount < 1 || charCount > 240) {
    fail(`line is ${charCount} characters; must be 1-240`);
  }
  if (LINE.trim().length === 0) {
    fail("line is only whitespace");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    fail("line must be a single line");
  }

  // Create the output directory if missing. Never remove it, and never
  // clear anything in it beyond the single file this entry owns.
  mkdirSync(outputDir, { recursive: true });

  const target = join(outputDir, "entry.txt");
  writeFileSync(target, LINE + "\n", "utf8");

  console.log(`wrote ${charCount} characters to ${target}`);
}

main();
