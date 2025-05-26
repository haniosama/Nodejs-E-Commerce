import { Request, Response } from "express";
import OrderService from "../service/order";

export default class OrderControler{
    constructor(private orderService:OrderService){}

    async createOrder(req:Request,res:Response){
        const body=req.body;
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        console.log(token,"token")
        const resSer=await this.orderService.handleCreateOrder(body,token);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async getOrdersForUser(req:Request,res:Response){
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const userId:string=req.params.userId;
        const resSer=await this.orderService.handlegetOrdersForUser(userId,token);
        console.log(resSer)
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async deleteSpecificOrder(req:Request,res:Response){
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const orderId:string=req.params.orderId;
        console.log(token,"lllllllllllllllllll")
        const resSer=await this.orderService.handledeleteSpecificOrder(orderId,token);
        console.log(resSer)
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else if(resSer.status == "fail"){
            res.status(404).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async deleteAllOrders(req:Request,res:Response){
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const userId:string=req.params.userId;
        const resSer=await this.orderService.handleDeletetAllOrder(userId,token);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else if(resSer.status == "fail"){
            res.status(404).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async complateOreder(req:Request,res:Response){
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const orderId:string=req.params.orderId;
        const resSer=await this.orderService.handleComplateOrder(orderId,token);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else if(resSer.status == "fail"){
            res.status(404).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async getOrderForAdmin(req:Request,res:Response){
        const token=req.headers["authorization"]?.split(" ")[1] as string;
        const adminId:string=req.params.adminId;
        const resSer=await this.orderService.handleGetOrderForAdmin(adminId,token);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else if(resSer.status == "fail"){
            res.status(404).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }

    
}