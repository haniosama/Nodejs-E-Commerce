import { Router, Request, Response } from "express";
import verifyToken from "../middleware/verifyToken";
import { getAdminProducts, getUserData } from "../control/dashboard";

const router = Router();

router.route("/dashboard").get(verifyToken, getAdminProducts);
router.route("/user/:id").get(verifyToken, getUserData);

export default router;
