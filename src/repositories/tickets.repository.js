import { Ticket } from "../dao/index.js";

export default class TicketRepository {
  constructor() {
    this.dao = Ticket;
  }

  async createTicket(ticketData) {
    return await this.dao.createTicket(ticketData);
  }

  async getTicketById(id) {
    return await this.dao.getTicketById(id);
  }
}
