// src/data/models/Product.js
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: String,
  thumbnails: [String],
});

productSchema.plugin(paginate);

export default mongoose.model("Product", productSchema);