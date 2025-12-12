import { describe, it, expect, vi } from "vitest";
import {
  translateJAItoGAI,
  translateGAItoJAI,
  getThoughtFromResponse,
  getBlockNoneSafetySettings,
  GAISystemPromptMode,
  findSystemPromptInMessage,
} from "../gai";
import { GAIError, JAIError } from "../../errors";
import { FinishReason } from "@google/genai";
import { getLocalSystemPrompt } from '../../customprompt'



describe("gai adapter", () => {
  it("throws when missing messages", () => {
    expect(() => translateJAItoGAI(undefined as any)).toThrow(JAIError.MISSING_MESSAGES);
  });

  it("extracts system prompt in CONTEXT mode and builds params", () => {
    const req = {
      model: "g-model",
      messages: [
        { role: "system", content: "<systemprompt>hello world</systemprompt>" },
        { role: "user", content: "say hi" },
      ],
    };
    const params = translateJAItoGAI(req as any, true, undefined, GAISystemPromptMode.CONTEXT);
    expect(params.model).toBe("g-model");
    expect(params.config?.systemInstruction).toBe("hello world");
    expect(Array.isArray(params.contents) && params.contents.length).toBe(2);
  });

  it("gets local system prompt in LOCAL mode and builds params", () => {
    vi.mock('../../customprompt', () => ({
      getLocalSystemPrompt: vi.fn(() => "This is a local system prompt.")
    }))
    const req = {
      model: "g-model",
      messages: [
        { role: "system", content: "<systemprompt>hello world</systemprompt>" },
        { role: "user", content: "say hi" },
      ],
    };
    const params = translateJAItoGAI(req as any, true, undefined, GAISystemPromptMode.LOCAL);
    expect(params.model).toBe("g-model");
    expect(params.config?.systemInstruction).toBe("This is a local system prompt.");
    expect(Array.isArray(params.contents) && params.contents.length).toBe(2);
  });

  it("find system prompt in chaotic first message in CONTEXT mode", () => {
    const firstMessage = "CONTEXT <user_persona>5'7\", male, bottom-heavy, olive skin. Plush brown hair, grey eyes, slight stubble, cat-like smirk</user_persona>\nHere's a bunch of\n\nrandom **content** <systemprompt>I am a prompt</systemprompt>\n\nand follow up garbage yeahhhh <turkey>bawk</turkey>";
    const systemPrompt = findSystemPromptInMessage(firstMessage);
    expect(systemPrompt).toBe("I am a prompt");
  });
  
  it("errors when CONTEXT mode but no system prompt", () => {
    const req = { model: "g1", messages: [{ role: "system", content: "no tag" }] };
    expect(() => translateJAItoGAI(req as any, false, undefined, GAISystemPromptMode.CONTEXT)).toThrow(GAIError.MISSING_CONTEXT_SYSTEM_PROMPT);
  });


  it("translateGAItoJAI maps finish reasons and returns expected shape", () => {
    const resp = {
      text: "hi",
      candidates: [{ finishReason: FinishReason.MAX_TOKENS, content: { parts: [{ text: "hi" }] } }],
      modelVersion: "g1",
    } as any;
    const jai = translateGAItoJAI(resp);
    expect(jai.choices[0].finish_reason).toBe("length");
    expect(jai.choices[0].message.content).toBe("hi");
    expect(jai.model).toBe("g1");
  });

  it("throws when blocked content present", () => {
    const resp = { promptFeedback: { blockReason: "any" } } as any;
    expect(() => translateGAItoJAI(resp)).toThrow(GAIError.BLOCKED_CONTENT);
  });

  it("getThoughtFromResponse concatenates thought parts", () => {
    const resp = {
      candidates: [
        { content: { parts: [{ thought: true, text: "t1" }, { thought: false, text: "ignore" }, { thought: true, text: "t2" }] } },
      ],
    } as any;
    expect(getThoughtFromResponse(resp)).toBe("t1\nt2");
  });

  it("getBlockNoneSafetySettings returns entries", () => {
    const arr = getBlockNoneSafetySettings();
    expect(Array.isArray(arr) && arr.length).toBeGreaterThan(0);
  });
});