import mongoose from "mongoose";
import { ICoupon } from "../interface/coupon";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number, 
    required: true,
    min: 0,
    max: 1000,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  adminId:{
    type:String,
    required:true
  },
  counterUser:{
    type:Number,
    default:0
  }
});

const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema);

export default CouponModel;
