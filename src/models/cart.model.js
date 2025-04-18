import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartModel = mongoose.model(collection, schema);

export default cartModel;