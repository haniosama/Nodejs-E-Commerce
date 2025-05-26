import express from "express";
import CartControl from "../control/cart";
import CartService from "../service/cart";
import verifyToken from "../middleware/verifyToken"; 

const router = express.Router();
const cartControl = new CartControl(new CartService());

router.post("/cart/add", verifyToken, (req, res) => cartControl.addToCart(req, res));
router.get("/cart", verifyToken, (req, res) => cartControl.getUserCart(req, res));  
router.put("/cart/update", verifyToken, (req, res) => cartControl.updateQuantity(req, res));
router.delete("/cart/remove/:productId", verifyToken, (req, res) => cartControl.removeFromCart(req, res));
router.delete("/cart/clear", verifyToken, (req, res) => cartControl.clearCart(req, res));
router.post("/cart/apply-coupon", verifyToken, (req, res) => cartControl.applyCoupon(req, res));


export default router;
