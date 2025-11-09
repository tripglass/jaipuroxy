import {
  Controller,
  Post,
  Route,
  Body,
  Query,
  Header,
  Response,
  SuccessResponse,
  TsoaResponse,
} from "tsoa";
import {
  addOROReasoningToJAI,
  getOROReasoningFromResponse,
  ORO_URL,
} from "../adapters/oro";
import { RequestErrors } from "../errors";
import axios from "axios";

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
    @Query() logReasoning?: boolean,
    @Header("authorization") authorization?: string
  ): Promise<any> {
    // Validate auth header
    if (!authorization) {
      this.setStatus(401);
      return { error: RequestErrors.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      console.debug("Incoming request:");
      console.debug(body);
      console.debug("Adding reasoning");
      const puffpuffpass = addOROReasoningToJAI(body);
      if (puffpuffpass && preset) {
        console.debug("Applying preset: " + preset);
        puffpuffpass.preset = preset;
      } else {
        console.debug("No preset applied.");
      }

      console.debug("Posting to OAI...");
      const response = await requestClient.post(ORO_URL, puffpuffpass, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      });

      const reasoning = getOROReasoningFromResponse(response);
      if (reasoning && logReasoning) {
        console.log("Reasoning:");
        console.log(reasoning);
      }
      this.setStatus(200);
      return response.data;
    } catch (err: any) {
      console.error(err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
