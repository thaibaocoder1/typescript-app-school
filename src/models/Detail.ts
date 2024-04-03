import { DataResource } from "../services/index";

export interface OrderDetailProps {
  _id: string;
  productID: string;
  orderID: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const OrderDetail = new DataResource<OrderDetailProps>(
  "http://localhost:8888/api/details"
);
