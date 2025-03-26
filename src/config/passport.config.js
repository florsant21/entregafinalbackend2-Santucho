import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import userModel from "../models/user.model.js";
import {
  createHash,
  isValidPassword,
  PRIVATE_KEY,
  cookieExtractor,
} from "../utils.js";

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
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
            password,
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
  passport.use(
    "login",
    new passportLocal.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          console.log("Intentando iniciar sesión con:", username);

          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.warn("Usuario no encontrado:", username);
            return done(null, false, { message: "Usuario no encontrado" });
          }

          if (!isValidPassword(user, password)) {
            console.warn("Contraseña incorrecta para usuario:", username);
            return done(null, false, { message: "Credenciales inválidas" });
          }

          console.log("Usuario autenticado con éxito:", username);
          return done(null, user);
        } catch (error) {
          console.error("Error en la estrategia de login:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializando usuario:", user);
    done(null, user._id);
  });

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
