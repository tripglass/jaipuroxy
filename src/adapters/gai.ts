import {
  FinishReason,
  GenerateContentParameters,
  GenerateContentResponse,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
} from "@google/genai";
import { JAIRequest, JAIResponse } from "./jai";
import { GAIError, JAIError } from "../errors";
import { getLocalSystemPrompt } from "../customprompt";

export const GAISystemPromptRegex =  /<systemprompt>([\s\S]+)<\/systemprompt>/

export enum GAISystemPromptMode {
  LOCAL = "LOCAL",
  CONTEXT = "CONTEXT",
}

export async function generateContent(
  apiKey: string,
  params: GenerateContentParameters
) {
  const ai = new GoogleGenAI({ apiKey: apiKey });
  return await ai.models.generateContent(params);
}

export function translateJAItoGAI(body: JAIRequest, includeThoughts?: boolean, systemPromptMode?: GAISystemPromptMode | false): GenerateContentParameters {
  if (!body || !body.messages) {
    throw new Error(JAIError.MISSING_MESSAGES);
  }

  const googleAIContents = [];

  let systemPrompt = undefined;
  if (systemPromptMode == GAISystemPromptMode.LOCAL) {
    systemPrompt = getLocalSystemPrompt();
    if (!systemPrompt) {
      console.error("No local system prompt found in systemprompt.md for LOCAL mode.");
      throw new Error(GAIError.MISSING_LOCAL_SYSTEM_PROMPT);
    }
  }

  for (const [index, msg] of body.messages.entries()) {
    if (msg.content) {
      let content = msg.content;
      if (msg.content.length == 0) {
          console.warn("GAI request has empty parts, intentional?");
      } 
      if (systemPromptMode == GAISystemPromptMode.CONTEXT && index == 0) {
        systemPrompt = findSystemPromptInMessage(msg.content);
        if (!systemPrompt) {
          console.error("No system prompt found in first message for CONTEXT mode.");
          throw new Error(GAIError.MISSING_CONTEXT_SYSTEM_PROMPT);
        }
        content.replace(systemPrompt, ""); //remove system prompt from message to save tokens
      }
      const role = msg.role === "user" ? "user" : "model";
      googleAIContents.push({
        role: role,
        parts: [{ text: content }],
      });
    }
  }
    if (googleAIContents.length == 0) {
    throw new Error(JAIError.MISSING_CONTENTS);
  }

  let params: GenerateContentParameters = {
    model: body.model,
    contents: googleAIContents,
    config: {
      safetySettings: getBlockNoneSafetySettings(),
      systemInstruction: systemPrompt,
      thinkingConfig: {
        includeThoughts: includeThoughts
      }
    },
  };
  return params;
}

export function translateGAItoJAI(body: GenerateContentResponse) {
  const messageContent = body.text;
  const candidate = body.candidates?.[0];
  const model = body.modelVersion;

  if (body.promptFeedback?.blockReason) {
    throw new Error(GAIError.BLOCKED_CONTENT)
  }
  if (messageContent === undefined && model === undefined) {
    throw new Error(GAIError.MISSING_FIELDS);
  } else if (messageContent === undefined) {
    throw new Error(GAIError.MISSING_CONTENTS);
  } else if (model === undefined) {
    throw new Error(GAIError.MISSING_MODEL);
  }

  // Map Gemini's FinishReason enum to a string.
  const finishReason = candidate
    ? mapFinishReason(candidate.finishReason)
    : "UNKNOWN";

  const responsePayload: JAIResponse = {
    choices: [
      {
        message: {
          content: messageContent,
          role: "assistant",
        },
        finish_reason: finishReason,
      },
    ],
    model: model,
  };
  return responsePayload;
}

export function getThoughtFromResponse(body: GenerateContentResponse) {
    const parts = body.candidates?.[0]?.content?.parts;
    if (!parts) {
        return null;
    }
    let thought = parts.filter(part => part.thought).map(part => part.text).join("\n");
    return thought;
}

export function getBlockNoneSafetySettings(): SafetySetting[] {
  return [
    {
      category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }, //DEPRECATED
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
}

function mapFinishReason(reason: FinishReason | undefined): string {
  if (!reason) return "NULL";
  switch (reason) {
    case FinishReason.STOP:
      return "stop";
    case FinishReason.MAX_TOKENS:
      return "length";
    case FinishReason.SAFETY:
      return "safety";
    case FinishReason.RECITATION:
      return "recitation";
    case FinishReason.OTHER:
      return "other";
    default:
      return "unknown";
  }
}


export function findSystemPromptInMessage(message: string): string | undefined {
    const match = message.match(GAISystemPromptRegex);
    if (match && match[1]) {
        return match[1].trim();
    }
    return undefined;
}