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
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      default: function (this: Catalogs) {
        return slugify(this.title, { lower: true, trim: true, locale: "vi" });
      },
    },
  },
  { timestamps: true }
);

export const Catalog = model<Catalogs>("Catalog", catalogSchema);
