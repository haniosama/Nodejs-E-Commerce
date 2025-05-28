import verifyToken from "../middleware/verifyToken";
import stripe from "../service/stripe";
import cartService from "../service/cart";
import CartModel from "../model/cart";
import { ICartProduct } from "../interface/cart";
const express = require("express");
const router = express.Router();

router.post("/checkout-session", verifyToken, async (req: any, res: any) => {
  const cart = await CartModel.findOne({ userId: req.user.userID });

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const line_items = cart.products.map((item) => ({
    price_data: {
      currency: "egp",
      product_data: {
        name: (item.productDetails as any).title
          .split(" ")
          .slice(0, 7)
          .join(" ") as string,
        description: (item.productDetails as any).description
          .split(" ")
          .slice(0, 7)
          .join(" ") as string,
        images: [(item.productDetails as any).imageCover],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session: any = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: line_items,

      metadata: {
        userDetails: JSON.stringify(req.user),
        shipping_details: JSON.stringify(req.body),
        token: req.token,
      },

      customer_email: req.user.email,
      client_reference_id: req.user.userID,
      success_url: req.query.success_url,
      cancel_url:
        req.query.success_url.substring(
          0,
          req.query.success_url.lastIndexOf("/")
        ) + "/cart",
    });

    res.json({ url: session.url });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

export default router;
