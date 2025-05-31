import Router, { Request, Response } from "express";
import CouponService from "../service/coupon";
import CouponConterol from "../control/coupon";


const router=Router();

const couponService=new CouponService();
const couponConterol=new CouponConterol(couponService);


router.get("/coupon",(req:Request,res:Response)=>couponConterol.getCouponsForAdmin(req,res))
router.get("/coupon/manager",(req:Request,res:Response)=>couponConterol.getCouponsForManager(req,res))
router.post("/coupon",(req:Request,res:Response)=>couponConterol.createDiscount(req,res))
router.delete("/coupon/:couponId",(req:Request,res:Response)=>couponConterol.deleteCoupon(req,res))






















export default router