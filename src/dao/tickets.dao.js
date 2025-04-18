import ticketModel from "./models/ticket.model.js";

export default class TicketDAO {
  async createTicket(ticketData) {
    return await ticketModel.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketModel.findById(id);
  }
}
