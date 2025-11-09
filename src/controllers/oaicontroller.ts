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
  addOAIReasoningToJAI,
  getOAIReasoningFromResponse,
  OAI_URL,
} from "../adapters/oai";
import { RequestErrors } from "../errors";
import axios from "axios";

const requestClient = axios.create({
  timeout: 180000,
  responseEncoding: "utf8",
  maxContentLength: 50 * 1024 * 1024,
  maxRedirects: 5,
  decompress: true,
});

@Route("api/oai")
export class OAIController extends Controller {
  /**
   * Proxy to OAI with optional preset.
   * @param body JAI request body
   * @param preset optional preset name to apply
   * @param authorization Authorization header (Bearer token)
   */
  @Post("thinky")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async oaiProxy(
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
      const puffpuffpass = addOAIReasoningToJAI(body);
      if (puffpuffpass && preset) {
        console.debug("Applying preset: " + preset);
        puffpuffpass.preset = preset;
      } else {
        console.debug("No preset applied.");
      }

      console.debug("Posting to OAI...");
      const response = await requestClient.post(OAI_URL, puffpuffpass, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      });

      const reasoning = getOAIReasoningFromResponse(response);
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
