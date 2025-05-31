import  jwt  from 'jsonwebtoken';
import CouponModel from "../model/coupon";

export default class CouponService{
  constructor(){}


  async hangdleGetCouponsForAdmin(token:string,){
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

  async hangdleGetCouponsForManager(token:string,){
    try{
      const decodeToken=jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string };
      console.log(decodeToken)
      if(decodeToken.role == "manager"){
        const coupons=await CouponModel.find({});
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
        let couponsFun;
        if(decodeToken.role == "admin"){
          couponsFun=await this.hangdleGetCouponsForManager(token);
        }
        if(decodeToken.role == "manager"){
          couponsFun=await this.hangdleGetCouponsForManager(token);
        }
        return{
          status:"success",
          coupons:couponsFun?.coupons
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