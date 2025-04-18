import UserRepository from "./users.repository.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";

export const UserRepo = new UserRepository();
export const ProductRepo = new ProductRepository();
export const CartRepo = new CartRepository();
export const TicketRepo = new TicketRepository();
