import { Body, Controller, Header, Post, Query, Route, Response } from "tsoa";
import axios from "axios";
import { RequestErrors } from "../errors";
import {
  addZAIReasoningToJAI,
  getZAIReasoningFromResponse,
  ZAI_URL,
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
  @Post("thinky")
  @Response(401, "Unauthorized")
  @Response(500, "Internal Error")
  public async zaiProxy(
    @Body() body: any,
    @Header("authorization") authorization?: string,
    @Query() logReasoning?: boolean
  ): Promise<any> {
    if (!authorization) {
      this.setStatus(401);
      return { error: RequestErrors.MISSING_AUTHORIZATION_HEADER };
    }
    try {
      console.debug("Incoming request:");
      console.debug(body);
      let puffpuffpass = addZAIReasoningToJAI(body);

      console.debug("Transformed request:");
      console.debug(puffpuffpass);
      console.debug("Posting to ZAI...");

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
      console.error(err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
