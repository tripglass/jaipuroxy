import { Body, Controller, Header, Post, Query, Route, Response } from "tsoa";
import axios from "axios";
import { RequestErrors, ZAIErrors } from "../errors";
import {
  addZAIReasoningToJAI,
  getZAIReasoningFromResponse,
  ZAI_BASE_URL,
  ZAI_CHAT_COMPLETIONS_ENDPOINT,
  ZAI_CODING_PATH,
  ZAIEndpoints as ZAIEndpoint,
} from "../adapters/zai";

const requestClient = axios.create({
  timeout: 180000,
  responseEncoding: "utf8",
  maxContentLength: 50 * 1024 * 1024,
  maxRedirects: 5,
  decompress: true,
});

@Route("api/zai")
export class ZAIController extends Controller {
  
  /**
   * Uses the Z.AI chat API endpoint for completion, enables reasoning.
   * @param body The JAI request body.
   * @param authorization Mandatory. Needs to be 'Bearer <Z.AI_API_KEY>', automatically set by JAI if you put in your Z.AI API key in the proxy config.
   * @param logReasoning Optional. For running locally: If available, reasoning will be logged to console.
   * @returns JAI compatible response from Z.AI.
   */
  @Post("thinky/chat")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async zaiProxyChat(
    @Body() body: any,
    @Header("authorization") authorization?: string,
    @Query() logReasoning?: boolean
  ): Promise<any> {
    return this.zaiProxy(body, ZAIEndpoint.CHAT, authorization, logReasoning);
  }

  /**
   * Uses the Z.AI coding API endpoint for completion, enables reasoning.
   * @param body The JAI request body.
   * @param authorization Mandatory. Needs to be 'Bearer <Z.AI_API_KEY>', automatically set by JAI if you put in your Z.AI API key in the proxy config.
   * @param logReasoning Optional. For running locally: If available, reasoning will be logged to console.
   * @returns JAI compatible response from Z.AI.
   */
  @Post("thinky/coding")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async zaiProxyCoding(
    @Body() body: any,
    @Header("authorization") authorization?: string,
    @Query() logReasoning?: boolean
  ): Promise<any> {
    return this.zaiProxy(body, ZAIEndpoint.CODING, authorization, logReasoning);
  }

  async zaiProxy(body: any, endpoint: ZAIEndpoint, authorization?: string, logReasoning?: boolean) {
    if (!authorization) {
      this.setStatus(401);
      return { error: RequestErrors.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      console.debug("Incoming request:");
      console.debug(body);
      
      let puffpuffpass = addZAIReasoningToJAI(body);

      console.debug(`Used ZAI endpoint ${endpoint}`);

      if (!endpoint || (endpoint !== ZAIEndpoint.CHAT && endpoint !== ZAIEndpoint.CODING)) {
          throw new Error( ZAIErrors.MISSING_ENDPOINT);
      } 

      const ZAI_URL = endpoint === ZAIEndpoint.CODING ?
        ZAI_BASE_URL + ZAI_CODING_PATH + ZAI_CHAT_COMPLETIONS_ENDPOINT:
        ZAI_BASE_URL + ZAI_CHAT_COMPLETIONS_ENDPOINT;
      
        
        if (puffpuffpass && endpoint === ZAIEndpoint.CODING) {
          delete puffpuffpass['temperature']; //coding endpoint doesn't support temperature param
        }
        
      console.log(`Posting to ZAI URL ${ZAI_URL}...`);
      const response = await requestClient.post(ZAI_URL, puffpuffpass, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      });
      console.debug("Response from ZAI:");
      console.debug(response.data);

      const reasoning = getZAIReasoningFromResponse(response);
      if (reasoning && logReasoning) {
        console.log("Reasoning:");
        console.log(reasoning);
      }
      this.setStatus(200);
      return response.data;
    } catch (err: any) {
      console.log("!! ERROR !!")
      console.error(err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}

