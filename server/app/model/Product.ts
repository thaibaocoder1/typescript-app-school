import { Schema, model } from "mongoose";
import slugify from "slugify";

interface Products extends Document {
  categoryID: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  thumb: string;
  content: string;
  status: number;
  quantity: number;
}
const productSchema: Schema = new Schema(
  {
    categoryID: { type: Schema.Types.ObjectId, required: true, ref: "Catalog" },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    thumb: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

productSchema.pre<Products>("save", async function (next) {
  const item = this as Products;
  const slug = slugify(item.name, { lower: true, trim: true });
  item.slug = slug;
  return next();
});

export const Product = model<Products>("Product", productSchema);
