import { DataResource } from "../services/index";

export type ApiResponseProducts<T = ProductProps> = {
  status: string;
  message: string;
  results?: number;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    totalRows: number;
  };
};
export interface ProductProps {
  _id: string;
  categoryID: string;
  name: string;
  slug: string;
  description: string;
  code: string;
  price: number;
  discount: number;
  thumb: {
    data: Buffer;
    contentType: string;
    fileName: string;
  };
  content: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export const Product = new DataResource<ProductProps | ApiResponseProducts>(
  "http://localhost:8888/api/products"
);
