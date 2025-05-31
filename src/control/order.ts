import { Request, Response } from "express";
import OrderService from "../service/order";
const stripe = require("stripe")(
  "sk_test_51RIoHiPIQ1yR8iDOP98CF0qn8i1Nlah7DrdlsPacHtHkeBOIzAfbAQjL808J3P2i9iaSbvAynUnbYkyiS3TSZKsg00lnuDtbTk"
);

export default class OrderControler {
  constructor(private orderService: OrderService) {}

  async getAllOders(req: Request, res: Response) {
    
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const resSer = await this.orderService.handleGetAllOders( token );
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    }else if(resSer?.status == "fail"){
      res.status(400).send(resSer);
    }else {
      res.status(500).send(resSer);
    }
  }
  async createOrder(req: Request, res: Response) {
    const body = req.body;
    // console.log("Create Order BODY" , body);
    
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const resSer = await this.orderService.handleCreateOrder(body, token );
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }
  async getOrdersForUser(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const userId: string = req.params.userId;
    const resSer = await this.orderService.handlegetOrdersForUser(
      userId,
      token
    );
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }
  async deleteSpecificOrder(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const orderId: string = req.params.orderId;
    const resSer = await this.orderService.handledeleteSpecificOrder(
      orderId,
      token
    );
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }
  async deleteAllOrders(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const userId: string = req.params.userId;
    const resSer = await this.orderService.handleDeletetAllOrder(userId, token);
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }
  async complateOreder(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const orderId: string = req.params.orderId;
    const resSer = await this.orderService.handleComplateOrder(orderId, token);
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }
  async getOrderForAdmin(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const adminId: string = req.params.adminId;
    const resSer = await this.orderService.handleGetOrderForAdmin(
      adminId,
      token
    );
    if (resSer.status == "success") {
      res.status(200).send(resSer);
    } else if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(500).send(resSer);
    }
  }

//   async checkout(req: Request, res: Response) {
//     const body = req.body;

//     // console.log("req body", req.user);

//     try {
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         customer_email: "mohamedm1@gmail.com",
//         line_items: [
//           {
//             price_data: {
//               currency: "egp",
//               product_data: {
//                 name: `mohamed mamdouh`,
//               },
//               unit_amount: 100000, // Amount in cents
//             },
//             quantity: 1,
//           },
//         ],
//         mode: "payment",
//         success_url: "http://localhost:4200/orders",
//         cancel_url: "http://localhost:4200/cart",
//       });

//       res.json({ url: session.url });
//     } catch (err) {
//       if (err instanceof Error) {
//         res.status(500).json({ error: err.message });
//       } else {
//         res.status(500).json({ error: "An unknown error occurred." });
//       }
//     }
//   }
}
