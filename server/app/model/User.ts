import { Schema, model } from "mongoose";

interface Users extends Document {
  fullname: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  password_confirmation: string;
  roleID: number;
  imageUrl: Object;
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
      type: Number,
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
    roleID: {
      type: Number,
      required: [true, "Role ID should not be empty!"],
    },
    imageUrl: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  },
  { timestamps: true }
);

export const User = model<Users>("User", userSchema);
