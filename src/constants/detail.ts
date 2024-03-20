import { ProductProps } from "../models/Product";

export interface RenderInfoProductParams {
  infoIDElement: string;
  infoIDThumbnail: string;
  infoIDContent: string;
  productInfo: ProductProps;
}
export interface RenderInfoProductRelated {
  infoIDElement: string;
  categoryID: string | number;
  productID: string;
}
