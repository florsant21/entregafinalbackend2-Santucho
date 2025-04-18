import { Cart } from "../dao/index.js";

export default class CartRepository {
  constructor() {
    this.dao = Cart;
  }

  async getCartById(id) {
    return await this.dao.getCartById(id);
  }

  async createCart() {
    return await this.dao.createCart();
  }

  async addProductToCart(cartId, productId) {
    return await this.dao.addProductToCart(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await this.dao.removeProductFromCart(cartId, productId);
  }

  async clearCart(cartId) {
    return await this.dao.clearCart(cartId);
  }
}
