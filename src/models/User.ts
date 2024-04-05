import { DataResource } from "../services/index";

export interface UserProps {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
  isActive: boolean;
  imageUrl: {
    data: Buffer;
    contentType: string;
    fileName: string;
  };
  refreshToken: string;
  resetedAt?: number;
  createdAt: string;
  updatedAt: string;
}

export const User = new DataResource<UserProps>(
  "http://localhost:8888/api/users"
);
