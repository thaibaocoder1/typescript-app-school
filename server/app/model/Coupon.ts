import { Schema, model } from "mongoose";

interface Coupons extends Document {
  name: string;
}

const couponSchema = new Schema<Coupons>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

export const Coupon = model<Coupons>("Coupon", couponSchema);
