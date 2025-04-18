import UserDAO from "./users.dao.js";
import ProductDAO from "./products.dao.js";
import CartDAO from "./carts.dao.js";
import TicketDAO from "./tickets.dao.js";

export const User = new UserDAO();
export const Product = new ProductDAO();
export const Cart = new CartDAO();
export const Ticket = new TicketDAO();
