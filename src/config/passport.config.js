import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import userModel from "../models/user.model.js";
import { createHash, PRIVATE_KEY, cookieExtractor } from "../utils.js";

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  // Estrategia JWT
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          console.log("JWT Payload recibido:", jwt_payload);
          return done(null, jwt_payload.user);
        } catch (error) {
          console.error("Error en estrategia JWT:", error);
          return done(error);
        }
      }
    )
  );

  // Estrategia de Registro Local
  passport.use(
    "register",
    new passportLocal.Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          console.log("Intentando registrar usuario:", username);
          
          const exists = await userModel.findOne({ email: username });
          if (exists) {
            console.warn("El usuario ya existe:", username);
            return done(null, false, { message: "El usuario ya existe." });
          }

          console.log("Creando nuevo usuario...");
          const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            loggedBy: "App",
          });

          const result = await newUser.save();
          console.log("Usuario creado con éxito:", result);

          return done(null, result);
        } catch (error) {
          console.error("Error en el registro:", error);
          return done(error);
        }
      }
    )
  );

  // Serialización del usuario (Guarda solo el ID en la sesión)
  passport.serializeUser((user, done) => {
    console.log("Serializando usuario:", user);
    done(null, user._id);
  });

  // Deserialización del usuario (Recupera usuario desde la BD)
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("Deserializando usuario con ID:", id);
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error al deserializar usuario:", error);
      done(error);
    }
  });
};

export default initializePassport;
