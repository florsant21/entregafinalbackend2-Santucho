import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

schema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = createHash(this.password);
  }
  next();
});

const userModel = mongoose.model(collection, schema);

export default userModel;
