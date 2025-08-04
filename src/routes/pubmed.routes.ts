import { Router } from "express";

import searchPubmedHandlerController from "../controllers/pubmed.controller";

const router = Router();

export function pubmedRoutes() {
  router.get("", searchPubmedHandlerController);
  return router;
}

export default router;
