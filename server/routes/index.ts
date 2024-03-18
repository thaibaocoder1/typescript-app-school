import { Express } from "express";
import catalog from "./catalog";
import user from "./user";
import product from "./product";

export function routes(app: Express) {
  app.use("/api/products", product);
  app.use("/api/users", user);
  app.use("/api/catalogs", catalog);
}
