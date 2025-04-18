import { CartRepo, ProductRepo, TicketRepo } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";

class CartController {
  constructor() {
    this.cartRepo = CartRepo;
    this.productRepo = ProductRepo;
    this.ticketRepo = TicketRepo;
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartRepo.getCartById(cartId);
      if (!cart) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Carrito no encontrado." });
      }
      res.status(200).send(cart);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al obtener el carrito.",
        });
    }
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartRepo.createCart();
      res.status(201).send(newCart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res
        .status(500)
        .send({ error: "Server Error", message: "Error al crear el carrito." });
    }
  }

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const updatedCart = await this.cartRepo.addProductToCart(
        cartId,
        productId
      );
      res.status(200).send(updatedCart);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al agregar producto al carrito.",
        });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;
      const updatedCart = await this.cartRepo.updateProductQuantity(
        cartId,
        productId,
        quantity
      );
      res.status(200).send(updatedCart);
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al actualizar la cantidad.",
        });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const updatedCart = await this.cartRepo.removeProductFromCart(
        cartId,
        productId
      );
      res.status(200).send(updatedCart);
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al eliminar el producto.",
        });
    }
  }

  async clearCart(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedCart = await this.cartRepo.clearCart(cartId);
      res.status(200).send(updatedCart);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al vaciar el carrito.",
        });
    }
  }

  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartRepo.getCartById(cartId);

      if (!cart) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Carrito no encontrado." });
      }

      let totalAmount = 0;
      const purchasedItems = [];
      const rejectedItems = [];

      for (const cartItem of cart.products) {
        const product = await this.productRepo.getProductById(
          cartItem.product._id
        );

        if (!product) {
          rejectedItems.push(cartItem.product._id);
          continue;
        }

        if (product.stock >= cartItem.quantity) {
          product.stock -= cartItem.quantity;
          await this.productRepo.updateProduct(product._id, product);
          totalAmount += product.price * cartItem.quantity;
          purchasedItems.push({
            product: product._id,
            quantity: cartItem.quantity,
          });
        } else {
          rejectedItems.push(cartItem.product._id);
        }
      }

      const user = await UserRepo.getUserById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Usuario no encontrado." });
      }

      const newTicket = {
        code: uuidv4(),
        amount: totalAmount,
        purchaser: user.email,
        products: purchasedItems,
      };

      const ticket = await this.ticketRepo.createTicket(newTicket);

      const remainingProducts = cart.products.filter((item) =>
        rejectedItems.includes(item.product._id.toString())
      );
      const updatedCart = await this.cartRepo.updateCart(cartId, {
        products: remainingProducts,
      });

      res.status(200).send({ ticket, rejectedItems });
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al finalizar la compra.",
        });
    }
  }
}

export default new CartController();
