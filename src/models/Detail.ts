import { DataResource } from "../services/index";
import { ProductProps } from "./Product";

export interface OrderDetailProps {
  _id: string;
  productID: string | ProductProps;
  orderID: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const OrderDetail = new DataResource<OrderDetailProps>(
  "http://localhost:8888/api/details"
);
