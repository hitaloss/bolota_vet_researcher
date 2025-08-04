import { Express } from "express";

import { pubmedRoutes } from "./pubmed.routes";

export const appRoutes = (app: Express) => {
  app.use("/search", pubmedRoutes());
};
