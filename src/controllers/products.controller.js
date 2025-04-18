import { ProductRepo } from "../repositories/index.js";

class ProductController {
  constructor() {
    this.productRepo = ProductRepo;
  }

  async getAllProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        lean: true,
      };
      const queryParams = query ? { $text: { $search: query } } : {};

      const products = await this.productRepo.getAllProducts(
        queryParams,
        options
      );
      res.status(200).send(products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al obtener los productos.",
        });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.pid;
      const product = await this.productRepo.getProductById(productId);
      if (!product) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Producto no encontrado." });
      }
      res.status(200).send(product);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al obtener el producto.",
        });
    }
  }

  async createProduct(req, res) {
    try {
      const newProductData = req.body;

      const newProduct = await this.productRepo.createProduct(newProductData);
      res.status(201).send(newProduct);
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al crear el producto.",
        });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;
      const updatedProductData = req.body;
      const updatedProduct = await this.productRepo.updateProduct(
        productId,
        updatedProductData
      );
      if (!updatedProduct) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Producto no encontrado." });
      }
      res.status(200).send(updatedProduct);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al actualizar el producto.",
        });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid;
      const deletedProduct = await this.productRepo.deleteProduct(productId);
      if (!deletedProduct) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Producto no encontrado." });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al eliminar el producto.",
        });
    }
  }
}

export default new ProductController();
