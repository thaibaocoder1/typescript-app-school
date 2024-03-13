import { DataResource } from "../services/index";

export interface ProductProps {
  _id: string;
  categoryID: number;
  name: string;
  slug: string;
  description: string;
  code: string;
  price: number;
  discount: number;
  thumb: string;
  content: string;
  status: number;
  quantity: number;
}

export const Product = new DataResource<ProductProps>(
  "http://localhost:8888/api/products"
);
