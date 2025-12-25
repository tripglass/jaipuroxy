import { Router } from "express";
import parentLogger from "./logger";

const router = Router();

let routes = {
  root: "/",
  oai_reasoning: "/oai/thinky",
  zai_reasoning_chat: "/zai/thinky/chat",
  zai_reasoning_coding: "/zai/thinky/coding",
  googleaistudio: "/gai/proxy",
  util: "/aux/snip"
};

router.get(routes.root, (req, res) => {
  res.send("Hello from the API!");
});

// Global CORS middleware: set headers for every request and
// reply to OPTIONS preflight requests for all routes on this router.
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    parentLogger.trace("Global preflight (OPTIONS) handled by middleware");
    return res.sendStatus(200);
  }
  next();
});

export default router;