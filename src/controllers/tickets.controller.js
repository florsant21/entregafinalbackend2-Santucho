import { TicketRepo } from "../repositories/index.js";

class TicketController {
  constructor() {
    this.ticketRepo = TicketRepo;
  }

  async getTicketById(req, res) {
    try {
      const ticketId = req.params.tid;
      const ticket = await this.ticketRepo.getTicketById(ticketId);
      if (!ticket) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "Ticket no encontrado." });
      }
      res.status(200).send(ticket);
    } catch (error) {
      console.error("Error al obtener el ticket:", error);
      res
        .status(500)
        .send({
          error: "Server Error",
          message: "Error al obtener el ticket.",
        });
    }
  }
}

export default new TicketController();
