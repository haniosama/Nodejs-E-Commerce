import mongoose from "mongoose";
import { ICart } from "../interface/cart";

let cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1."],
        },
      }
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
