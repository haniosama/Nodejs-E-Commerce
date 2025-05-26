require("dotenv").config({ debug: true });

const path = require("path");
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import authUser from "./routes/user";
import feedbackRouter from "./routes/feedback";
import productRouter from "./routes/produtc";
import categoriesRouter from "./routes/categories";
import orderRouter from "./routes/order";
import dashboardRouter from "./routes/dashboardRouter";
import cartRouter from "./routes/cart";
import CustomerRouter from "./routes/customer";
import wishlistRouter from "./routes/wishList";
const app = express();

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
