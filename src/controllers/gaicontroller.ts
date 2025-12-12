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
import { JAIRequest } from "../adapters/jai";

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
   * @param reasoningEffort Optional. Lets you set a determined number of tokens the model may use for reasoning, if you are using a model that is capable of reasoning. Setting this to a positive integer can force gemini-2.5-flash into reasoning mode. For flash: 0 to 24576, for pro: 128 to 32768. -1 lets the model decide.
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
    @Query() reasoningEffort?: number,
    @Query() logReasoning?: boolean
  ): Promise<any> {
    if (!authorization) {
      this.setStatus(401);
      return { error: RequestError.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      
      let geminiApiKey = authorization.replace("Bearer ", "");

      if (systemPromptMode) {
        console.debug("Using system prompt mode: " + systemPromptMode);
      }

      if (reasoningEffort !== undefined) {
        console.debug("Using reasoning effort: " + reasoningEffort);
      }

     console.debug(`Start of transmitted context: ${(body as JAIRequest).messages[2].content.substring(0,250)}...`)
     /*         
//TODO dat body too long, needs pino or something to log to file
     console.debug(`--- RECEIVED ---`)
console.debug(`${JSON.stringify(body)}`)
      console.debug(`--- END OF RECEIVED ---`)
      */
      let puffpuffpass = translateJAItoGAI(
        body,
        logReasoning,
        reasoningEffort,
        systemPromptMode
      );
      
      console.debug("Sending request to GAI");
      let response = await generateContent(geminiApiKey, puffpuffpass);
      console.debug("Received response from GAI");

      if (response === undefined ) {
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
