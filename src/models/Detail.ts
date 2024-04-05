import { DataResource } from "../services/index";
import { OrderProps } from "./Order";
import { ProductProps } from "./Product";

export interface OrderDetailProps {
  _id: string;
  productID: string | ProductProps;
  orderID: string | OrderProps;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const OrderDetail = new DataResource<OrderDetailProps>(
  "http://localhost:8888/api/details"
);
