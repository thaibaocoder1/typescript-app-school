import { DataResource } from "../services/index";

export interface Catalogs {
  _id: number;
  title: string;
  slug: string;
}

export const Catalog = new DataResource<Catalogs>(
  "http://localhost:8888/api/catalogs"
);
