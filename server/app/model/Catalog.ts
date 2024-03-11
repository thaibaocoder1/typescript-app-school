import { Schema, model } from "mongoose";
import slugify from "slugify";

interface Catalogs extends Document {
  title: string;
  slug: string;
}
const catalogSchema: Schema = new Schema<Catalogs>(
  {
    title: {
      type: String,
      required: [true, "Title should not be empty!"],
      unique: true,
    },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

catalogSchema.pre<Catalogs>("save", async function (next) {
  const catalog = this as Catalogs;
  const slug = typeof slugify(catalog.title, { lower: true, trim: true });
  catalog.slug = slug;
  return next();
});

export const Catalog = model<Catalogs>("Catalog", catalogSchema);
