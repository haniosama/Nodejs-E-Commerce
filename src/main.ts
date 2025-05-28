require("dotenv").config({ debug: true });

const path = require("path");
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import authUser from "./routes/user";
import feedbackRouter from "./routes/feedback";
import productRouter from "./routes/produtc";
import categoriesRouter from "./routes/categories";
import orderRouter from "./routes/order";
import dashboardRouter from "./routes/dashboardRouter";
import cartRouter from "./routes/cart";
import CustomerRouter from "./routes/customer";
import wishlistRouter from "./routes/wishList";
import paymentOnline from "./routes/paymentOnline";
import stripe from "./service/stripe";
import CartModel from "./model/cart";
import OrderService from "./service/order";

const app = express();

app.post(
  "/confirmOnlinePayment",
  express.raw({ type: "application/json" }),
  async (req: any, res: any) => {
    const endpointSecret =
      "whsec_aedc546b261c1197b3672da0355bd77db02c63c7afa4ca04034bb52a92444e9d";
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      } else {
        return res.status(400).send("Webhook Error");
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const {
        payment_method_types,
        success_url,
        cancel_url,
        customer_email,
        mode,
        amount_total,
        currency,
        payment_status,
        status,
        client_reference_id,
      } = session;

      let sessionData = {
        payment_method_types,
        success_url,
        cancel_url,
        customer_email,
        mode,
        amount_total: amount_total / 100,
        currency,
        payment_status,
        status,
      };

      const order_details = JSON.parse(session.metadata.shipping_details);
      const cart = await CartModel.findOne({ userId: client_reference_id });
      const products = cart?.products.map((pro) => pro);

      const body: any = {
        order_details,
        products,
        userId: client_reference_id,
      };

      const createOrder = new OrderService();
      createOrder.handleCreateOrder;
      const resSer = await createOrder.handleCreateOrder(
        body,
        session.metadata.token,
        sessionData
      );
    }

    res.json({ received: true });
  }
);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

mongoose
  .connect(MONGOURL as string)
  .then(() => {
    console.log("mongodb Connected");
  })
  .catch(() => console.log("failed", process.env.MONGOURL));

// Meddileware
app.use("/api", paymentOnline);
app.use("/api/auth", authUser);
app.use("/api", feedbackRouter);
app.use("/api", productRouter);
app.use("/api", categoriesRouter);
app.use("/api", orderRouter);
app.use("/api", dashboardRouter);
app.use("/api", cartRouter);
app.use("/api", CustomerRouter);
app.use("/api", wishlistRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
