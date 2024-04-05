import { Schema, model } from "mongoose";

interface Users extends Document {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
  imageUrl?: Object;
  isActive: boolean;
  refreshToken: string;
  createdAt?: Date;
  resetedAt?: number;
}

const userSchema = new Schema<Users>(
  {
    fullname: {
      type: String,
      required: [true, "Fullname should not be empty!"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username should not be empty!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email should not be empty!"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone should not be empty!"],
    },
    password: {
      type: String,
    },
    password_confirmation: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
    refreshToken: {
      type: String,
    },
    resetedAt: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const User = model<Users>("User", userSchema);
