import { Router } from "express";

import searchPubmedHandlerController from "../controllers/pubmed.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

export function pubmedRoutes() {
  router.get("", searchPubmedHandlerController);
  return router;
}

export default router;
