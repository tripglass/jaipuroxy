import {
  Controller,
  Post,
  Route,
  Body,
  Response,
} from "tsoa";
import parentLogger, { conditionallyLogRawResponseToFile, ensureLogFile, LOG_FILE_PATH, fileLogger } from "../logger";
import { snipToBotResponse } from "../adapters/util";
import { JAIPuroxyError } from "../errors";

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
      conditionallyLogRawResponseToFile(response);
      this.setStatus(200);
      return response;
    } catch (err: any) {
      logger.warn({ err: err }, err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
  
  /**
   * Logs the full context currently sent to the LLM.
   * @param body The JAI request body.
   * @returns Error 418 if logging worked, sorry for that lol
   */
  @Post("log")
  @Response(418, "Context Logged")
  @Response(500, "Internal Error")
  public async log(
    @Body() body: any
  ): Promise<any> {
    try {
      logger.info("called AUX method log");
    // because the only point of this method is to log the full context, we disregard the logging flag here and just do it.
      ensureLogFile(LOG_FILE_PATH);
      fileLogger.debug(`Transmitted Context: ${JSON.stringify(body)}`);

      this.setStatus(418);
      return {error: "Full context logged successfully."};
    } catch (err: any) {
      logger.warn({ err: err }, err.message);
      this.setStatus(500);
      return { error: "Something went wrong: " + err.message };
    }
  }
}
