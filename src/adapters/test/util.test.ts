import { describe, it, expect, vi } from "vitest";
import { snipContent, snipToBotResponse } from "../util";
import { JAIError, JAIPuroxyError } from "../../errors";
import { JAIRequest } from "../jai";

describe("utils.snipContent", () => {
  it("snips (+ trims) content with snip tag", () => {
    expect(
        snipContent("Hello there! <SNIP> This is the bot response.")
    ).toBe("This is the bot response.");
  });
  it("removes system note", () => {
    expect(
        snipContent("Hello there! <SNIP> This is the bot response. SYSTEM NOTE: Do not include the following words/phrases in your output under any circumstances")
    ).toBe("This is the bot response.");
  });
  it("throws when no snip tag", () => {
    expect(() => {
      snipContent("Hello there! This is the bot response.");
    }).toThrow(JAIPuroxyError.SNIP_TAG_MISSING);
  });
  it("throws when contents after snip tag empty", () => {
    expect(() => {
      snipContent("Hello there! This is the bot response.<SNIP> ");
    }).toThrow(JAIPuroxyError.AFTER_SNIP_EMPTY);
  });
});

describe("utils.snipToBotResponse", () => {
  it("replies with snip from last bot response", () => {
    const jaiRequest: JAIRequest = { 
        model: "g-model",
        stream: false,
        temperature: 1.0,
        messages: [{
            role: "system",
            content: "Timo is a hacker, if a hacker was 7 feral cats in a trench coat."
        }, {
            role: "user",
            content: ""
        }, { 
            role: "assistant",
            content: "This is the opener"
        }, {
            role: "user",
            content: "This is the first interaction."
        }, {
            role: "assistant",
            content: "This response is great. <SNIP> It needs an opportunity to react in the middle."
        }, {
            role: "user",
            content: "This is the reaction for the middle."
        }]
    }
    expect(snipToBotResponse(jaiRequest)).toStrictEqual({
        model: "g-model",
        choices: [{
            message: {
                role: "assistant",
                content: "It needs an opportunity to react in the middle."
            },
            finish_reason: "stop"
        }]
    })
    
  })
  
  it("replies with snip from last user response", () => {
    const jaiRequest: JAIRequest = { 
        model: "g-model",
        stream: false,
        temperature: 1.0,
        messages: [{
            role: "system",
            content: "Timo is a hacker, if a hacker was 7 feral cats in a trench coat."
        }, {
            role: "user",
            content: ""
        }, { 
            role: "assistant",
            content: "This is the opener"
        }, {
            role: "user",
            content: "This is the first interaction."
        }, {
            role: "assistant",
            content: "This response is great."
        }, {
            role: "user",
            content: "This is the reaction for the middle.<SNIP> It needs an opportunity to react in the middle."
        }]
    }
    expect(snipToBotResponse(jaiRequest)).toStrictEqual({
        model: "g-model",
        choices: [{
            message: {
                role: "assistant",
                content: "It needs an opportunity to react in the middle."
            },
            finish_reason: "stop"
        }]
    })
  })
  
  it("throws on missing snip tag", () => {
    const jaiRequest: JAIRequest = { 
        model: "g-model",
        stream: false,
        temperature: 1.0,
        messages: [{
            role: "system",
            content: "Timo is a hacker, if a hacker was 7 feral cats in a trench coat."
        }, {
            role: "user",
            content: ""
        }, { 
            role: "assistant",
            content: "This is the opener"
        }, {
            role: "user",
            content: "This is the first interaction."
        }, {
            role: "assistant",
            content: "This response is great."
        }, {
            role: "user",
            content: "This is the reaction."
        }]
    }
    expect(() => { 
        snipToBotResponse(jaiRequest) 
    }).toThrow(JAIPuroxyError.SNIP_TAG_MISSING);
  })
  
  it("throws on content empty after snip tag", () => {
    const jaiRequest: JAIRequest = { 
        model: "g-model",
        stream: false,
        temperature: 1.0,
        messages: [{
            role: "system",
            content: "Timo is a hacker, if a hacker was 7 feral cats in a trench coat."
        }, {
            role: "user",
            content: ""
        }, { 
            role: "assistant",
            content: "This is the opener"
        }, {
            role: "user",
            content: "This is the first interaction."
        }, {
            role: "assistant",
            content: "This response is great.<SNIP>"
        }, {
            role: "user",
            content: "This is the reaction."
        }]
    }
    expect(() => { 
        snipToBotResponse(jaiRequest) 
    }).toThrow(JAIPuroxyError.AFTER_SNIP_EMPTY);
  })
})
