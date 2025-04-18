import { Product } from "../dao/index.js";

export default class ProductRepository {
  constructor() {
    this.dao = Product;
  }

  async getAllProducts(query, options) {
    return await this.dao.getAllProducts(query, options);
  }

  async getProductById(id) {
    return await this.dao.getProductById(id);
  }

  async createProduct(product) {
    return await this.dao.createProduct(product);
  }

  async updateProduct(id, product) {
    return await this.dao.updateProduct(id, product);
  }

  async deleteProduct(id) {
    return await this.dao.deleteProduct(id);
  }

  async updateProductStock(productId, newStock) {
    return await this.dao.updateProductStock(productId, newStock);
  }
}
