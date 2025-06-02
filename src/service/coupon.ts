import  jwt  from 'jsonwebtoken';
import CouponModel from "../model/coupon";
import { error } from 'console';

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

  async hangdleDiscount(token:string,body:{code:string,discount:number}){
    try{
      const decodeToken=jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string };
      if(decodeToken.role =='admin'){
        const couponFounded=await CouponModel.findOne({code:body.code});
        if(couponFounded){
          return{
              status:"fail",
              coupons:"This Coupon Aready Founded"
            }
        }else{
          const newCoupon=new CouponModel({...body,adminId:decodeToken.userID});
          await newCoupon.save()
          const coupons=await CouponModel.find({})
          return{
              status:"success",
              coupons
            }
          }
        }else{
          return{
              status:"error",
              message:"Unauthorized: Only admins can get coupons"
            }
      }
    }catch(error){
      return{
          status:"error",
          error
        }
    }
    
  };

   async hangdleDeleteCoupon(token:string,couponId:string){
    try{
      const decodeToken=jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string };
      console.log(decodeToken)
      if(decodeToken.role !== "user"){
        await CouponModel.deleteOne({adminId:decodeToken.userID,_id:couponId});
        let couponsFun;
        if(decodeToken.role == "admin"){
          couponsFun=await this.hangdleGetCouponsForAdmin(token);
        }
        if(decodeToken.role == "manager"){
          couponsFun=await this.hangdleGetCouponsForManager(token);
        }
        console.log("aaaaaaaaaaaaaaaa",couponsFun)
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