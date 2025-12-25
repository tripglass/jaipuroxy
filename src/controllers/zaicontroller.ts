import { Body, Controller, Header, Post, Query, Route, Response } from "tsoa";
import axios from "axios";
import { RequestError, ResponseError, ZAIError } from "../errors";
import {
  addZAIReasoningToJAI,
  getZAIReasoningFromResponse,
  ZAI_BASE_URL,
  ZAI_CHAT_COMPLETIONS_ENDPOINT,
  ZAI_CODING_PATH,
  ZAIEndpoints as ZAIEndpoint,
} from "../adapters/zai";
import parentLogger, { logTransmittedContextStart } from "../logger";

const requestClient = axios.create({
  timeout: 180000,
  responseEncoding: "utf8",
  maxContentLength: 50 * 1024 * 1024,
  maxRedirects: 5,
  decompress: true,
});

const logger = parentLogger.child({ name: "ZAIController" });

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

  async zaiProxy(
    body: any,
    endpoint: ZAIEndpoint,
    authorization?: string,
    logReasoning?: boolean
  ) {
    if (!authorization) {
      logger.warn(RequestError.MISSING_AUTHORIZATION_HEADER);
      this.setStatus(401);
      return { error: RequestError.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      logger.info("called ZAI proxy");
      //console.debug("Incoming request:");
      //console.debug(body);
      logger.debug("Applying reasoning");
      let puffpuffpass = addZAIReasoningToJAI(body);

      if (
        !endpoint ||
        (endpoint !== ZAIEndpoint.CHAT && endpoint !== ZAIEndpoint.CODING)
      ) {
        throw new Error(ZAIError.MISSING_ENDPOINT);
      }

      const ZAI_URL =
        endpoint === ZAIEndpoint.CODING
          ? ZAI_BASE_URL + ZAI_CODING_PATH + ZAI_CHAT_COMPLETIONS_ENDPOINT
          : ZAI_BASE_URL + ZAI_CHAT_COMPLETIONS_ENDPOINT;

      if (puffpuffpass && endpoint === ZAIEndpoint.CODING) {
        delete puffpuffpass["temperature"]; //coding endpoint doesn't support temperature param
      }

      logTransmittedContextStart(body, logger);

      logger.debug(`Posting to ZAI URL ${ZAI_URL}...`);
      const response = await requestClient.post(ZAI_URL, puffpuffpass, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      });
      if (!response || !response.data) {
        logger.warn(ResponseError.MISSING_DATA);
        throw new Error(ResponseError.MISSING_DATA);
      }

      if (logReasoning) {
        const reasoning = getZAIReasoningFromResponse(response);
        if (reasoning) {
          logger.debug({ reasoning: "Reasoning received" }, reasoning);
        }
      }
      logger.info("ZAI request completed successfully.");
      this.setStatus(200);
      return response.data;
    } catch (err: any) {
      logger.warn({ err: err }, err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
