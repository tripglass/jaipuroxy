import { Body, Controller, Header, Post, Query, Route, Response } from "tsoa";
import {
  GAISystemPromptMode,
  generateContent,
  getThoughtFromResponse,
  translateGAItoJAI,
  translateJAItoGAI,
} from "../adapters/gai";
import axios from "axios";
import { RequestErrors } from "../errors";
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
      return { error: RequestErrors.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      console.debug("Incoming request:");
      console.debug(body);
      let geminiApiKey = authorization.replace("Bearer ", "");

      if (systemPromptMode) {
        console.debug("Using system prompt mode: " + systemPromptMode);
      }
      let puffpuffpass = translateJAItoGAI(
        body,
        logReasoning,
        systemPromptMode
      );
      let response = await generateContent(geminiApiKey, puffpuffpass);
      console.debug("Response from GAI:");
      console.debug(JSON.stringify(response));

      const reasoning = getThoughtFromResponse(response);
      if (reasoning && logReasoning) {
        console.log("Reasoning:");
        console.log(reasoning);
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
