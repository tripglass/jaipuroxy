export interface JAIRequest {
  messages: JAIMessage[];
  model: string;
  stream: boolean;
  temperature: number;
}

export type JAIRole = "system" | "user" | "assistant";

export interface JAIMessage {
  content: string;
  role: JAIRole;
}

export interface JAIResponse {
  choices: JAIChoice[];
  model: string;
}

export interface JAIChoice {
  message: JAIMessage;
  finish_reason: string;
}
