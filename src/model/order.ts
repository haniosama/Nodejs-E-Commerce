import { IOrder } from "../interface/order";
import { IProduct } from "./../interface/product";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  order_details: {
    type: Object,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  products: {
    type: Array,
    required: true,
  },
  adminsId: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const OrderModel = mongoose.model<IOrder>("order", schema);

export default OrderModel;
