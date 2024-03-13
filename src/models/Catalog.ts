import { DataResource } from "../services/index";

export interface CatalogProps {
  _id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export const Catalog = new DataResource<CatalogProps>(
  "http://localhost:8888/api/catalogs"
);
