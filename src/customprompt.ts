import path from "path";
import {readFile} from "fs/promises"; 

let promptText: string | undefined = undefined;


/**
 * Load the prompt from disk once. Not bothering with hot reloads until someone asks for it.
 */
export async function initPrompt(): Promise<void> {
  try {
    promptText = await readFile(path.resolve(__dirname, "../systemprompt.md"), "utf8");
    console.log("Prompt loaded successfully.");
    console.debug(promptText)
  } catch (err) {
    console.error("Failed to load systemprompt.md:", err);
    promptText = undefined;
  }
}

/** Synchronous getter for the cached prompt text. */
export function getLocalSystemPrompt(): string | undefined {
  return promptText;
}