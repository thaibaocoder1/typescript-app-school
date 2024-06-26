import { DataResource } from "../services/index";

export interface OrderProps {
  _id: string;
  fullname: string;
  email: string;
  address: string;
  note: string;
  phone: string;
  payment: string;
  status: number;
  cancelCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const Order = new DataResource<OrderProps>(
  "http://localhost:8888/api/orders"
);
