import cartModel from "./models/cart.model.js";

export default class CartDAO {
  async getCartById(id) {
    return await cartModel.findById(id).populate("products.product");
  }

  async createCart() {
    return await cartModel.create({});
  }

  async addProductToCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId });
    }
    return await cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error("Producto no encontrado en el carrito");
    }
    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );
    return await cart.save();
  }

  async clearCart(cartId) {
    return await cartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}
