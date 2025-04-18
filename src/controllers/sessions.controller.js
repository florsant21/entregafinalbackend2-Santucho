import { UserRepo } from "../repositories/index.js";
import { generateJWToken } from "../utils.js";
import UserDTO from "../dao/dtos/user.dto.js";

class SessionsController {
  constructor() {
    this.userRepo = UserRepo;
  }

  async register(req, res, next) {
    passport.authenticate("register", {
      failureRedirect: "/api/sessions/fail-register",
    })(req, res, next);
  }

  async failRegister(req, res) {
    res.status(401).send({ error: "Failed to process register!" });
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepo.getUserByEmail(email);

      if (!user || !isValidPassword(user, password)) {
        console.warn("Invalid credentials for user: " + email);
        return res
          .status(401)
          .send({ status: "error", error: "Credenciales invalidas!!!" });
      }

      const userDTO = new UserDTO(user);
      const access_token = generateJWToken(userDTO);

      res.cookie("jwtCookieToken", access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      res.send({
        status: "success",
        message: "Login successfull",
        token: access_token,
      });
    } catch (error) {
      console.error("Error en el login:", error);
      return res
        .status(500)
        .send({ status: "error", error: "Error interno de la applicacion." });
    }
  }

  async current(req, res) {
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

  async logout(req, res) {
    res.clearCookie("jwtCookieToken");
    res.redirect("/users/login");
  }
}

export default new SessionsController();
