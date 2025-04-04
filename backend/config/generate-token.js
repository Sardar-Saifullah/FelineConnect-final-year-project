import jwt from "jsonwebtoken";
export const generateLoginToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};
