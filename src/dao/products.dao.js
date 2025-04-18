import productModel from "./models/product.model.js";

export default class ProductDAO {
  async getAllProducts(query = {}, options = {}) {
    return await productModel.paginate(query, options);
  }

  async getProductById(id) {
    return await productModel.findById(id);
  }

  async createProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(id, product) {
    return await productModel.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id) {
    return await productModel.findByIdAndDelete(id);
  }

  async updateProductStock(productId, newStock) {
    return await productModel.findByIdAndUpdate(
      productId,
      { $set: { stock: newStock } },
      { new: true }
    );
  }
}
