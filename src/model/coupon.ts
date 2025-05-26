import mongoose from "mongoose";

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
});

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel;
