import { Request, Response } from "express";
import CouponService from "../service/coupon";

export default class CouponConterol{
  constructor(private  couponService:CouponService){}

  async getCoupons(req: Request, res: Response){
    const token=req.headers["authorization"]?.split(" ")[1] as string;
    const couponId=req.params.couponId;
    const resSer=await this.couponService.hangdleGetCoupons(token);
    if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
  }
  async createDiscount(req: Request, res: Response){
    const resSer=await this.couponService.hangdleDiscount();
    // if(resSer.status == "success"){
    //         res.status(200).send(resSer)
    //     }else{
    //         res.status(500).send(resSer)
    //     }
  }
  async deleteCoupon(req: Request, res: Response){
    const token=req.headers["authorization"]?.split(" ")[1] as string;
    const couponId=req.params.couponId;
    const resSer=await this.couponService.hangdleDeleteCoupon(token,couponId);
    if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
  }
}