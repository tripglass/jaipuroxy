export enum GAIError {
    MISSING_CONTENTS = "GAI request is missing contents for JAI translation.",
    MISSING_MODEL = "GAI request is missing model for JAI translation.",
    MISSING_FIELDS = "GAI response is missing required fields for JAI translation.",
    BLOCKED_CONTENT = "GAI rejected the request for BLOCKED_CONTENT",
    MISSING_CONTEXT_SYSTEM_PROMPT = "GAI request is missing system prompt enclosed in <systemprompt> tag in first message for CONTEXT mode.",
    MISSING_LOCAL_SYSTEM_PROMPT = "GAI request is missing local system prompt in systemprompt.md at project root for LOCAL mode.",

}

export enum JAIError {
    MISSING_MESSAGES = "Invalid JAI request: missing messages",
    MISSING_CONTENTS = "Invalid JAI request: no message with contents",
}

export enum RequestError {
    MISSING_AUTHORIZATION_HEADER = "Missing Authorization header - did you set an API key?",
}

export enum ZAIError {
    MISSING_ENDPOINT = "Missing ZAI endpoint parameter - please specify CHAT or CODING.",
}

export enum ResponseError {
    MISSING_DATA = "Response is missing.",
}
