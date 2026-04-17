import { JAIError, JAIPuroxyError } from "../errors";
import parentLogger from "../logger";
import { JAIRequest, JAIResponse } from "./jai";

const SNIP_TAG = "<SNIP>";

const logger = parentLogger.child({ name: "Util" }); 

export function snipContent(content: string): string {
    logger.debug("Snipping content at <SNIP> tag");
    logger.debug(`Original content: ${content}...`);
    const snipIndex = content.indexOf(SNIP_TAG);
    if (snipIndex === -1) {
        logger.warn(JAIPuroxyError.SNIP_TAG_MISSING);
        throw new Error(JAIPuroxyError.SNIP_TAG_MISSING);
    }
    let splitContent = content.split(SNIP_TAG);
    let targetContent = splitContent[1].trim();
    if (targetContent.includes("SYSTEM NOTE:")) {
        targetContent = targetContent.split("SYSTEM NOTE:")[0].trim();
    }
    if (targetContent.length === 0) {
        logger.warn(JAIPuroxyError.AFTER_SNIP_EMPTY);
        throw new Error(JAIPuroxyError.AFTER_SNIP_EMPTY);
    }
    logger.debug(`Snipped response: ${targetContent}...`);
    return targetContent;
}

export function snipToBotResponse(body: JAIRequest): JAIResponse | null {
    if (!body || !body.messages || body.messages.length === 0) {
        logger.warn(JAIError.MISSING_MESSAGES)
        throw new Error(JAIError.MISSING_MESSAGES);
    }
    let messageContent;
    //get most recent bot response, last response is user message
    const lastMessage = body.messages[body.messages.length-2]; 
    try {
        messageContent = snipContent(lastMessage.content);
    } catch (err: any) {
        if (err.message === JAIPuroxyError.SNIP_TAG_MISSING) {
            const lastMessage = body.messages[body.messages.length-1]; 
            messageContent = snipContent(lastMessage.content);
        } else {
            throw err;
        }
    }
    const responsePayload: JAIResponse = {
    choices: [
      {
        message: {
          content: messageContent,
          role: "assistant",
        },
        finish_reason: "stop",
      },
    ],
    model: body.model,
  };
  return responsePayload;
}

/**
 * returns undefined if authorization header is:
 * - falsy (e.g. undefined)
 * - empty string
 * - "Bearer" with only whitespace after
 * 
 * returns unmodified authorization header otherwise. **NOTE:** This method doesn't actually check whether the API key 
 * itself looks reasonable.
 * 
 * Method purpose:
 * 
 * JAI mandates the API key field be filled to send a request. This function flattens an authorization header where " " 
 * has been entered as API key in JAI into undefined to trigger using API keys from .env file.
 * 
 * @param authorization authorization header
 * @returns "valid looking" authorization header or undefined
 */
export function unsetInvalidAuthorizationHeader(authorization?: string): string | undefined {
    if (!authorization || authorization.trim() === "" || authorization.trim() === "Bearer") {
        return undefined;
    }
    return authorization;
}
