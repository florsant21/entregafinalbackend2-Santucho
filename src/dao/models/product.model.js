import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: [String],
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  owner: {
    type: String,
    default: "admin",
  },
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
