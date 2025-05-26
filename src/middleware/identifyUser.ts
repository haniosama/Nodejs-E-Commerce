import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(
      token,
      process.env.TOKEN_SECRET || "fallback_secret",
      (err, user) => {
        console.log(process.env.TOKEN_SECRET);
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      }
    );
  } else {
    res.sendStatus(401);
  }
}
export default authenticateJWT;
