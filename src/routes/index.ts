import { Express } from "express";

import { pubmedRoutes } from "./pubmed.routes";
import { sessionRoutes } from "./session.routes";

export const appRoutes = (app: Express) => {
  app.use("/search", pubmedRoutes());
  app.use("/session", sessionRoutes());
};
