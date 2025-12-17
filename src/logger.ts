import pino from "pino";
console.info(`initalising pino logger with level ${JSON.stringify(process.env.PINO_LOG_LEVEL)}`);
const sanitisedLogLevel = process.env.PINO_LOG_LEVEL?.trim(); //lmfao windows adding random spaces
const parentLogger = pino({
  name: "JAIPuroxy",
  level: sanitisedLogLevel || (process.env.NODE_ENV === "production" ? "info" : "debug")
});

export default parentLogger;