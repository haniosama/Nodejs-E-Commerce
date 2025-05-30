import  jwt  from 'jsonwebtoken';
import CouponModel from "../model/coupon";

export default class CouponService{
  constructor(){}


  async hangdleGetCoupons(token:string,){
    try{
      const decodeToken=jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string };
      console.log(decodeToken)
      if(decodeToken.role !== "user"){
        const coupons=await CouponModel.find({adminId:decodeToken.userID});
        return{
          status:"success",
          coupons
        }
      }
      else{
        return{
          status:"fail",
          message:"Unauthorized: Only admins can get coupons"
        }
      }
    }
    catch(errors){
      return{
        status:"error",
        errors
      }
    }
  };

  hangdleDiscount(){
    
  };

   async hangdleDeleteCoupon(token:string,couponId:string){
    try{
      const decodeToken=jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string };
      console.log(decodeToken)
      if(decodeToken.role !== "user"){
        await CouponModel.deleteOne({adminId:decodeToken.userID,_id:couponId});
        const couponsFun=await this.hangdleGetCoupons(token);
        return{
          status:"success",
          coupons:couponsFun.coupons
        }
      }else{
        return{
          status:"success",
          message:"Unauthorized: Only admins can delete"
        }
      }
    }
    catch(errors){
      return{
        status:"fail",
        errors
      }
    }
  };

}