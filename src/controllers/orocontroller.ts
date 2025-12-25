import {
  Controller,
  Post,
  Route,
  Body,
  Query,
  Header,
  Response,
} from "tsoa";
import {
  addOROReasoningToJAI,
  getOROReasoningFromResponse,
  ORO_URL,
  OROReasoningEffort,
} from "../adapters/oro";
import { RequestError, ResponseError } from "../errors";
import axios from "axios";
import parentLogger, { logTransmittedContextStart } from "../logger";

const logger = parentLogger.child({ name: "OROController" });

const requestClient = axios.create({
  timeout: 180000,
  responseEncoding: "utf8",
  maxContentLength: 50 * 1024 * 1024,
  maxRedirects: 5,
  decompress: true,
});

@Route("api/oro")
export class OROController extends Controller {
  /**
   * Uses OpenRouter endpoint for completion, enables reasoning.
   * @param body The JAI request body.
   * @param authorization Mandatory. Needs to be 'Bearer <OpenRouter_API_KEY>', automatically set by JAI if you put in your OpenRouter API key in the proxy config.
   * @param preset Optional. Enables use of a preset configured in your OpenRouter account, e.g. to set the system prompt or customise providers. Example: @preset/sausagewithbuns
   * @param logReasoning  Optional. For running locally: If available, reasoning will be logged to console.
   * @returns JAI compatible response from OpenRouter.
   */
  @Post("thinky")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async oroProxy(
    @Body() body: any,
    @Query() preset?: string,
    @Query() reasoningEffort?: OROReasoningEffort,
    @Query() logReasoning?: boolean,
    @Header("authorization") authorization?: string
  ): Promise<any> {
    // Validate auth header
    if (!authorization) {
      logger.warn(RequestError.MISSING_AUTHORIZATION_HEADER);
      this.setStatus(401);
      return { error: RequestError.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      logger.info("called ORO proxy");
      //console.debug("Incoming request:");
      //console.debug(body);
      logger.debug("Adding reasoning");
      const puffpuffpass = addOROReasoningToJAI(
        body,
        reasoningEffort,
        logReasoning
      );
      if (puffpuffpass && preset) {
        logger.debug("Applying preset: " + preset);
        puffpuffpass.preset = preset;
      } else {
        logger.debug("No preset applied.");
      }

      logTransmittedContextStart(body, logger);

      logger.debug("Posting to OAI...");
      const response = await requestClient.post(ORO_URL, puffpuffpass, {
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
        const reasoning = getOROReasoningFromResponse(response);
        if (reasoning) {
          logger.debug({ reasoning: "Reasoning received" }, reasoning);
        }
      }
      logger.info("ORO request completed successfully.");
      this.setStatus(200);
      return response.data;
    } catch (err: any) {
      logger.warn({ err: err }, err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
