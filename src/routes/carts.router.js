import { Router } from "express";
import { passportCall } from "../utils.js";
import { isUser, isCartOwner } from "../middlewares/auth.middleware.js";
import CartController from "../controllers/carts.controller.js";

const router = Router();

router.get(
  "/:cid",
  passportCall("jwt"),
  isCartOwner,
  CartController.getCartById
);

router.post("/", CartController.createCart);

router.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUser,
  isCartOwner,
  CartController.addProductToCart
);

router.put(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUser,
  isCartOwner,
  CartController.updateProductQuantity
);

router.delete(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUser,
  isCartOwner,
  CartController.removeProductFromCart
);

router.delete(
  "/:cid",
  passportCall("jwt"),
  isUser,
  isCartOwner,
  CartController.clearCart
);

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  isUser,
  isCartOwner,
  CartController.purchaseCart
);

export default router;
