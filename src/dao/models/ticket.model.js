import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, default: uuidv4 },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const ticketModel = mongoose.model("tickets", ticketSchema);

export default ticketModel;
