import { Express } from "express";
import catalog from "./catalog";
import product from "./product";

export function routes(app: Express) {
  app.use("/api/catalogs", catalog);
  app.use("/api/products", product);
}
