import { Router } from "express";

import sessionController from "../controllers/session.controller";

const router = Router();

export function sessionRoutes() {
  router.post("", sessionController);
  return router;
}

export default router;
