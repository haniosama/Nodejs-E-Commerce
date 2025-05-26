import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyToken: RequestHandler = (req, res, next) => {
  let token = req.headers["authorization"] || req.headers["Authorization"];
  if (!token) {
    res.status(401).send({
      status: "Error",
      message: "No token provided!",
    });
    return;
  }

  token = Array.isArray(token) ? token[0] : token;
  token = token.split(" ")[1];
 console.log(token);


  if (!process.env.TOKEN_SECRET) {
    res.status(500).send({
      status: "Error",
      message: "Token secret is not defined!",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET
    ) as jwt.JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      status: "Error",
      message: "Token is not valid!",
    });
  }
};

export default verifyToken;
