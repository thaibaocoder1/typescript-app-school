import { Express } from "express";
import catalog from "./catalog";
import user from "./user";
import product from "./product";
import coupon from "./coupon";

export function routes(app: Express) {
  app.use("/api/users", user);
  app.use("/api/products", product);
  app.use("/api/catalogs", catalog);
  app.use("/api/counpons", coupon);
}
