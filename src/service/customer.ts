import  jwt  from 'jsonwebtoken';
import CustomerModel from "../model/customer";

export default class CustomerService{
    constructor(){}
    async handleGetAllCustomer(adminId:string,token:string){
        let decodedToken = jwt.verify(token,process.env.TOKEN_SECRET as string) as { role: string; userID: string }
        if(decodedToken.role =="admin"){
            try{
                const customers=await CustomerModel.find({adminsId:adminId});
                return{
                    status:"success",
                    customers
                }
            }
            catch(errors){
                return{
                    status:"fail",
                    errors
                }
            }
        }else{
            return {
                status: "Error",
                message: "You are not authorized to access this resource!",
            };
        }
    }
}