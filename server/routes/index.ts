import { Express } from "express";
import catalog from "./catalog";
import user from "./user";
import product from "./product";
import coupon from "./coupon";
import order from "./order";
import detail from "./detail";

export function routes(app: Express) {
  app.use("/api/users", user);
  app.use("/api/products", product);
  app.use("/api/catalogs", catalog);
  app.use("/api/coupons", coupon);
  app.use("/api/orders", order);
  app.use("/api/details", detail);
}
