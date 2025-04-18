import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const PRIVATE_KEY = process.env.JWT_SECRET || "BackendSecretKeyJWT";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
};
export default __dirname;
