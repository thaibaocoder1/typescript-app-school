import { DataResource } from "../services/index";

export interface CounponProps {
  _id: string;
  name: string;
  value: number;
  expireIns: number;
  createdAt: string;
  updatedAt: string;
}

export const Coupon = new DataResource<CounponProps>(
  "http://localhost:8888/api/counpons"
);
