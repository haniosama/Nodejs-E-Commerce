import mongoose from "mongoose";
import { ICart } from "../interface/cart";
import { object } from "joi";

let cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1."],
        },
        productDetails: {},
        price: {
          type: Number,
        },
        _id: String
      },
    ],
    discount: {
      type: Number,
      default: 0, // percentage
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

let CartModel = mongoose.model<ICart>("Cart", cartSchema);

export default CartModel;
