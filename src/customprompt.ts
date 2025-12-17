import path from "path";
import {readFile} from "fs/promises"; 
import parentLogger from "./logger";

let promptText: string | undefined = undefined;


/**
 * Load the prompt from disk once. Not bothering with hot reloads until someone asks for it.
 */
export async function initPrompt(): Promise<void> {
  try {
    promptText = await readFile(path.resolve(__dirname, "../systemprompt.md"), "utf8");
    parentLogger.info("Prompt loaded successfully.");
    parentLogger.debug(promptText)
  } catch (err) {
    parentLogger.error({err: err}, "Failed to load systemprompt.md");
    promptText = undefined;
  }
}

/** Synchronous getter for the cached prompt text. */
export function getLocalSystemPrompt(): string | undefined {
  return promptText;
}