import pino from "pino";
import { JAIRequest } from "./adapters/jai";
import fs from "fs";
import util from "node:util";
import path from "path";

console.info(
  `initalising pino logger with level ${JSON.stringify(process.env.PINO_LOG_LEVEL)}`,
);
const sanitisedLogLevel = process.env.PINO_LOG_LEVEL?.trim(); //lmfao windows adding random spaces

export const shouldLogContextToFile = process.env.LOG_CONTEXT_TO_FILE?.trim() === "true";
export const shouldLogRawResponseToFile = process.env.LOG_RAW_RESPONSE_TO_FILE?.trim() === "true";
export const LOG_FILE_PATH = process.env.LOG_PATH?.trim() || "./logs/server.log";

if (shouldLogContextToFile || shouldLogRawResponseToFile) {
  ensureLogFile(LOG_FILE_PATH);
}
const parentLogger = pino({
  name: "JAIPuroxy",
  level:
    sanitisedLogLevel ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
});

export const fileLogger = pino(
  {
    level: "debug",
  },
  pino.destination(LOG_FILE_PATH),
);

export default parentLogger;

export function logTransmittedContextStart(
  body: JAIRequest,
  logger: pino.Logger,
) {
  if (body?.messages?.[2]?.content) {
    logger.debug(
      `Start of transmitted posts: ${body.messages[2].content.substring(0, 250)}...`,
    );
  }
  if (shouldLogContextToFile) {
    fileLogger.debug(`Transmitted Context: ${JSON.stringify(body)}`);
  }
}

export function conditionallyLogRawResponseToFile(body: any) {
  if (shouldLogRawResponseToFile) {
    //util.inspect is safer because body can include circular references
    fileLogger.debug(`Raw Response: ${util.inspect(body)}`);
  }
}

export function ensureLogFile(filepath: string) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, "");
  }
}
