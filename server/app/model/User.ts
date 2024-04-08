import { Schema, model, QueryWithHelpers } from "mongoose";
import MongooseDelete from "mongoose-delete";

interface Users extends MongooseDelete.SoftDeleteDocument {
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
  recoverHashCode?: string;
  createdAt?: Date;
  resetedAt?: number;
  timeExpireRecover?: number;
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
    recoverHashCode: {
      type: String,
    },
    resetedAt: {
      type: Number,
    },
    timeExpireRecover: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedByType: String,
  overrideMethods: true,
});

export const User = model<Users>(
  "User",
  userSchema
) as MongooseDelete.SoftDeleteModel<Users>;
