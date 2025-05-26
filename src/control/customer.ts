import { Request, Response } from "express";
import CustomerService from "../service/customer";

export default class CustomeControler{
    constructor(private customerService:CustomerService){
    }

    async getAllCustomer(req:Request,res:Response){
        const adminId:string=req.params.adminId;
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const resSer=await this.customerService.handleGetAllCustomer(adminId,token);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
}