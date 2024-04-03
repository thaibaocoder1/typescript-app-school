import { Schema, model } from "mongoose";

interface Orders extends Document {
  fullname: string;
  email: string;
  address: string;
  note: string;
  status: number;
  phone: string;
}

const orderSchema: Schema = new Schema<Orders>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = model<Orders>("Order", orderSchema);
