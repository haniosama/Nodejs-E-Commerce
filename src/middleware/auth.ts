import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["authorization"] as string;
  if (token) {
    next();
  } else {
    res.status(400).json({
      status: "error",
      message: "token Not Found",
    });
  }
};

const checkRole = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["authorization"] as string;
  if (token) {
    try {
      let user: any = jwt.verify(token, process.env.TOKEN_SECRET as string);
      if (user.role == "admin") {
        next();
      } else {
        res.status(500).json({
          status: "fail",
          message: "This operation  available for admin",
        });
      }
    } catch (errors) {
      res.status(500).json({
        status: "fail",
        errors,
      });
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "token Not Found",
    });
  }
};

export = { checkRole, tokenValidation };
