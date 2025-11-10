import { Body, Controller, Header, Post, Query, Route, Response } from "tsoa";
import {
  GAISystemPromptMode,
  generateContent,
  getThoughtFromResponse,
  translateGAItoJAI,
  translateJAItoGAI,
} from "../adapters/gai";
import axios from "axios";
import { RequestError, ResponseError } from "../errors";
import { sys } from "typescript";

const requestClient = axios.create({
  timeout: 180000,
  responseEncoding: "utf8",
  maxContentLength: 50 * 1024 * 1024,
  maxRedirects: 5,
  decompress: true,
});

@Route("api/gai")
export class GAIController extends Controller {
  /**
   * Translates a JAI request into a Google AI request, sends it to GAI, then translates the response back to JAI format.
   * @param body Mandatory. The JAI request body.
   * @param authorization Mandatory. Needs to be 'Bearer <GoogleAI_API_KEY>', automatically set by JAI if you put in your Google AI Studio API key in the proxy config.
   * @param systemPromptMode Optional. Sets "system instructions" which the model will adhere more strictly to. LOCAL loads the system prompt in the server file system, i.e. systemprompt.md - use if you are running it locally, or you want to use the server's "default" system prompt. CONTEXT reads whatever contents put between <systemprompt>...</systemprompt> in the first message of the conversation and uses that as the system prompt. If not specified, no system prompt is set.
   * @param logReasoning Optional. For running locally: If available, reasoning will be logged to console.
   * @returns JAI compatible response from GAI.
   */
  @Post("proxy")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async gaiProxy(
    @Body() body: any,
    @Header("authorization") authorization?: string,
    @Query() systemPromptMode?: GAISystemPromptMode,
    @Query() logReasoning?: boolean
  ): Promise<any> {
    if (!authorization) {
      this.setStatus(401);
      return { error: RequestError.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      //console.debug("Incoming request:");
      //console.debug(body);
      let geminiApiKey = authorization.replace("Bearer ", "");

      if (systemPromptMode) {
        console.debug("Using system prompt mode: " + systemPromptMode);
      }
      let puffpuffpass = translateJAItoGAI(
        body,
        logReasoning,
        systemPromptMode
      );
      console.debug("Sending request to GAI");
      let response = await generateContent(geminiApiKey, puffpuffpass);

      if (!response || !response.candidates || response.candidates.length == 0) {
        throw new Error(ResponseError.MISSING_DATA);
      }

      if (logReasoning) {
        const reasoning = getThoughtFromResponse(response);
        if (reasoning) {
          console.log("Reasoning:");
          console.log(reasoning);
        }
      }

      console.debug("Translating back to JAI");
      let jaiResponse = translateGAItoJAI(response);
      this.setStatus(200);
      return jaiResponse;
    } catch (err: any) {
      console.error(err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
