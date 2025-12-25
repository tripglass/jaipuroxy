import {
  Controller,
  Post,
  Route,
  Body,
  Response,
} from "tsoa";
import parentLogger from "../logger";
import { snipToBotResponse } from "../adapters/util";

const logger = parentLogger.child({ name: "AUXController" });

@Route("api/aux")
export class AUXController extends Controller {
  /**
   * Splits up bot's most recent response at <SNIP> tag and returns the second part as a "bot" response again.
   * @param body The JAI request body.
   * @returns JAI compatible response.
   */
  @Post("snip")
  @Response(500, "Internal Error")
  public async snip(
    @Body() body: any
  ): Promise<any> {
    try {
      logger.info("called AUX method snip");
      let response = snipToBotResponse(body)
      this.setStatus(200);
      return response;
    } catch (err: any) {
      logger.warn({ err: err }, err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
