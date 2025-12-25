import pino from "pino";
import { JAIRequest } from "./adapters/jai";
console.info(`initalising pino logger with level ${JSON.stringify(process.env.PINO_LOG_LEVEL)}`);
const sanitisedLogLevel = process.env.PINO_LOG_LEVEL?.trim(); //lmfao windows adding random spaces
const parentLogger = pino({
  name: "JAIPuroxy",
  level: sanitisedLogLevel || (process.env.NODE_ENV === "production" ? "info" : "debug")
});

export default parentLogger;

export function logTransmittedContextStart(body: JAIRequest, logger: pino.Logger) {
  if (body?.messages?.[2]?.content) {
    logger.debug(`Start of transmitted posts: ${body.messages[2].content.substring(0,250)}...`)
  }
}