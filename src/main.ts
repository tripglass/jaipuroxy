import express from "express";
import routes from "./routes";
import { RegisterRoutes } from "./generated/routes";
import { initPrompt } from "./customprompt";

async function main() {
  await initPrompt(); // load once at startup

  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", routes);

  RegisterRoutes(app);

  const portEnv = process.env.PORT ?? "8089";
  const PORT = Number.parseInt(portEnv, 10);
  if (Number.isNaN(PORT) || PORT <= 0) {
    console.error(`Invalid PORT value "${portEnv}"`);
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start app:", err);
  process.exit(1);
});