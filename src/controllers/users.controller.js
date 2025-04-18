import { UserRepo } from "../repositories/index.js";
import UserDTO from "../dao/dtos/user.dto.js";

class UserController {
  constructor() {
    this.userRepo = UserRepo;
  }

  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No se encontró el usuario" });
      }
      const userDTO = new UserDTO(req.user);
      res.status(200).json(userDTO);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener datos del usuario" });
    }
  }
}

export default new UserController();
