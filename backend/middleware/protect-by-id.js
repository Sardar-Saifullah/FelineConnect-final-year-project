import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const protectById = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({
        where: { id: decoded.id },
      });
      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
