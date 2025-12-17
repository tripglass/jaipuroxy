import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import favicon from "serve-favicon";
import routes from "./routes";
import parentLogger from "./logger";
import { RegisterRoutes } from "./generated/routes";
import { initPrompt } from "./customprompt";
import { ValidateError } from "tsoa";
import { JAIPuroxyError, RequestError } from "./errors";
import path from "path";

async function main() {
  await initPrompt(); // load once at startup

  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  app.use("/api", routes);

  RegisterRoutes(app);

  app.use(function notFoundHandler(req, res: ExResponse) {
    parentLogger.warn({returnedErrorCode: 404}, `Could not find ${req.path}`);
    res.status(404).send({
      message: RequestError.NOT_FOUND,
    });
  });

  app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      parentLogger.warn({err: err, returnedErrorCode: 422}, `Caught Validation Error for ${req.path}`);
      return res.status(422).json({
        message: RequestError.VALIDATION_FAILED,
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      parentLogger.warn({err: err, returnedErrorCode: 500}, `Caught Error for ${req.path}`);
      return res.status(500).json({
        message: JAIPuroxyError.INTERNAL_SERVER_ERROR,
      });
    }

    next();
  });

  const portEnv = process.env.PORT ?? "8089";
  const PORT = Number.parseInt(portEnv, 10);
  if (Number.isNaN(PORT) || PORT <= 0) {
    parentLogger.fatal(`Invalid PORT value "${portEnv}"`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    parentLogger.info(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  parentLogger.fatal({ err: err }, "Failed to start app:");
  process.exit(1);
});
