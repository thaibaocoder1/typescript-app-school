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
  refreshToken: string;
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
      default: "123abc",
    },
    password_confirmation: {
      type: String,
      default: "123abc",
    },
    role: {
      type: String,
      default: "User",
    },
    imageUrl: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = model<Users>("User", userSchema);
