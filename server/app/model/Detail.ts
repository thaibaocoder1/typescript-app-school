import { Schema, model } from "mongoose";

interface Details extends Document {
  orderID: string | Schema.Types.ObjectId;
  productID: string | Schema.Types.ObjectId;
  userID: string | Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

const detailSchema: Schema = new Schema<Details>(
  {
    orderID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    productID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Detail = model<Details>("Detail", detailSchema);
