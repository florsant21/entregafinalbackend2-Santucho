import { TicketRepo } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import EmailService from "./email.service.js";

class TicketService {
  constructor() {
    this.ticketRepo = TicketRepo;
    this.emailService = EmailService;
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await this.ticketRepo.createTicket({
        ...ticketData,
        code: uuidv4(),
        purchase_datetime: new Date(),
      });
      await this.emailService.sendPurchaseConfirmation(newTicket);
      return newTicket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await this.ticketRepo.getTicketById(ticketId);
      return ticket;
    } catch (error) {
      console.error("Error al obtener el ticket:", error);
      throw error;
    }
  }
}

export default new TicketService();
