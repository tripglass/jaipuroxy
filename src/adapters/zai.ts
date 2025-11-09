import type { JAIChoice, JAIMessage, JAIRequest, JAIResponse } from "./jai";

export const ZAI_URL = "https://api.z.ai/api/paas/v4/chat/completions";


export interface Thinking {
    type: "enabled" | "disabled"
}

export interface ZAIRequest extends JAIRequest {
    thinking?: Thinking,
} 

export interface ZAIMessage extends JAIMessage {
    reasoning_content?: string,
}

export interface ZAItoJAIChoice extends JAIChoice {
    index: number,
    message: ZAIMessage
}

export interface ZAItoJAIResponse extends JAIResponse {
    id: string,
    request_id: string, 
    created: number, //timestamp? 1759064384,
    model: string, 
    choices: ZAItoJAIChoice[],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number,
        prompt_tokens_details?: {
            cached_tokens: number
        } 
    }
}

export function addZAIReasoningToJAI(body: JAIRequest): ZAIRequest | null {
    if (!body || !body.messages) {
        return null;
    }
    let zairequest: ZAIRequest = body;
    zairequest.thinking = {
        type: "enabled"
    }
    return zairequest;
}

export function getZAIReasoningFromResponse(response: any): string | undefined {
    return response.data.choices[0].message?.reasoning_content;
}