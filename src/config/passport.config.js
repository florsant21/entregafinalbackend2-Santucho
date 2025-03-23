import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import userModel from "../models/user.model.js";
import { createHash, PRIVATE_KEY, cookieExtractor } from "../utils.js";

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
          return done(null, jwt_payload.user);
        } catch (error) {
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
          const exists = await userModel.findOne({ email: username });
          if (exists) {
            return done(null, false, { message: "El usuario ya existe." });
          }
          const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            loggedBy: "App",
          });
          const result = await newUser.save();
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
