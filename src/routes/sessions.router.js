import { Router } from "express";
import passport from "passport";
import userModel from "../models/user.model.js";
import { isValidPassword, generateJWToken } from "../utils.js";

const router = Router();

router.post(
  "/register",
  async (req, res, next) => {
    passport.authenticate("register", async (err, user, info) => {
      if (err) {
        console.error("Error en el registro:", err);
        return res.status(500).send({ error: "Error en el servidor." });
      }
      if (!user) {
        console.warn("Fallo en el registro:", info);
        return res.status(401).send({ error: "No se pudo crear el usuario." });
      }
      console.log("Usuario registrado con éxito:", user);
      res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
    })(req, res, next);
  }
);

router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Failed to process register!" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user)
      return res.status(401).json({ message: "Usuario no encontrado" });

    if (!isValidPassword(user, password)) {
      console.warn("Invalid credentials for user: " + email);
      return res
        .status(401)
        .send({ status: "error", error: "Credenciales invalidas!!!" });
    }

    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      isAdmin: user.role === "admin",
    };

    const access_token = generateJWToken(tokenUser);
    console.log("access_token", access_token);

    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
      httpOnly: true,
    });

    res.send({ message: "Login successfull" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No se encontró el usuario" });
      }
      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener datos del usuario" });
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken");
  res.redirect("/users/login");
});

export default router;
