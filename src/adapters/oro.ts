import type { JAIChoice, JAIMessage, JAIRequest, JAIResponse } from "./jai";

export const ORO_URL = "https://openrouter.ai/api/v1/chat/completions";

export type OROReasoningEffort = "minimal"|"low"|"medium"|"high"|"xhigh";


export interface OROReasoning {
    // One of the following (not both):

    effort?: OROReasoningEffort,

    max_tokens?: number, // Specific token limit (Anthropic-style)

    // Optional: Default is false. All models support this.

    exclude?: boolean, // Set to true to exclude reasoning tokens from response

    // Or enable reasoning with the default parameters:

    enabled?: boolean // Default: inferred from `effort` or `max_tokens`
}

export interface ORORequest extends JAIRequest {
    reasoning?: OROReasoning,
    preset?: string,
} 

export interface OROMessage extends JAIMessage {
    refusal?: string,
    reasoning?: string,
}

export interface OROtoJAIChoice extends JAIChoice {
    logprobs?: string, //?
    native_finish_reason: string,
    index: number,
    message: OROMessage
}

export interface OROtoJAIResponse extends JAIResponse {
    id: string,
    provider: string, 
    model: string, 
    object: string, // "chat.completion",
    created: number, //timestamp? 1759064384,
    choices: OROtoJAIChoice[],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number,
        prompt_tokens_details?: string //? null
    }
}

export function addOROReasoningToJAI(body: JAIRequest, reasoningEffort?: OROReasoningEffort, logReasoning?: boolean): ORORequest | null {
    if (!body || !body.messages) {
        return null;
    }
    let oairequest: ORORequest = body;
    oairequest.reasoning = {
        enabled: true
    }
    if (reasoningEffort) {
        oairequest.reasoning.effort = reasoningEffort;
    }
    if (!logReasoning) {
        oairequest.reasoning.exclude = true;
    }
    return oairequest;
}

export function getOROReasoningFromResponse(response: any): string | undefined {
    return response.data.choices[0].message?.reasoning;
}