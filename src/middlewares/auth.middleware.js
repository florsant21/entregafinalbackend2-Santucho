import { ProductRepo } from "../repositories/index.js";
import { UserRepo } from "../repositories/index.js";

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .send({
        error: "Forbidden",
        message: "Se requiere rol de administrador.",
      });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res
      .status(403)
      .send({ error: "Forbidden", message: "Se requiere rol de usuario." });
  }
  next();
};

export const isCartOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ error: "Unauthorized", message: "Usuario no autenticado." });
    }

    const cartId = req.params.cid;
    const user = await UserRepo.getUserById(req.user.id);

    if (!user || user.cart.toString() !== cartId) {
      return res
        .status(403)
        .send({
          error: "Forbidden",
          message: "No tienes permiso para acceder a este carrito.",
        });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el propietario del carrito:", error);
    res
      .status(500)
      .send({
        error: "Server Error",
        message: "Error interno al verificar el carrito.",
      });
  }
};

export const isProductOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ error: "Unauthorized", message: "Usuario no autenticado." });
    }

    const productId = req.params.pid;
    const product = await ProductRepo.getProductById(productId);

    if (!product) {
      return res
        .status(404)
        .send({ error: "Not Found", message: "Producto no encontrado." });
    }

    if (
      req.user.role === "admin" ||
      (product.owner && product.owner === req.user.email)
    ) {
      next();
    } else {
      return res
        .status(403)
        .send({
          error: "Forbidden",
          message: "No tienes permiso para modificar este producto.",
        });
    }
  } catch (error) {
    console.error("Error al verificar el propietario del producto:", error);
    res
      .status(500)
      .send({
        error: "Server Error",
        message: "Error interno al verificar el producto.",
      });
  }
};
