import { Router } from "express";
import { passportCall } from "../utils.js";
import {
  isAdmin,
  isProductOwnerOrAdmin,
} from "../middlewares/auth.middleware.js";
import productController from "../controllers/products.controller.js";

const router = Router();

router.get("/", productController.getAllProducts);

router.get("/:pid", productController.getProductById);

router.post("/", passportCall("jwt"), isAdmin, productController.createProduct);

router.put(
  "/:pid",
  passportCall("jwt"),
  isProductOwnerOrAdmin,
  productController.updateProduct
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  isProductOwnerOrAdmin,
  productController.deleteProduct
);

export default router;
