import { Schema, model } from "mongoose";
import slugify from "slugify";

interface Products extends Document {
  categoryID: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  thumb: {
    data: Buffer;
    contentType: string;
    fileName: string;
  };
  content: string;
  quantity: number;
}
const productSchema: Schema = new Schema(
  {
    categoryID: { type: Schema.Types.ObjectId, required: true, ref: "Catalog" },
    name: { type: String, required: true },
    code: { type: String, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    thumb: { data: Buffer, contentType: String, fileName: String },
    content: { type: String },
    quantity: { type: Number },
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
