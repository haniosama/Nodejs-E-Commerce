import jwt from "jsonwebtoken";
import { IOrder } from "../interface/order";
import CustomerModel from "../model/customer";
import OrderModel from "../model/order";
import ProductModel from "../model/product";
import UserModel from "../model/user";
import CartModel from "../model/cart";

export default class OrderService {
  constructor() {}

  async handleCreateOrder(
    body: IOrder,
    token: string,
    onlinePaymentDetails?: any
  ) {

    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      let adminsId: string[] = [];
      let total: number = 0;
      let products: {}[] = [];
      try {
        for (let i = 0; i < body.products.length; i++) {

          await ProductModel.updateOne(
            { _id: body.products[i].productId },
            {
              $inc: {
                sold: body.products[i].quantity,
                quantity: -body.products[i].quantity,
              },
            }
          );
          const adminId = body.products[i].productDetails.adminId;
          if (typeof adminId === "string" && !adminsId.includes(adminId)) {
            adminsId.push(adminId);
          }
          total +=
            Number(body.products[i].price) * Number(body.products[i].quantity);
          products.push({
            ...body.products[i],
            quantity: body.products[i].quantity,
          });

        }

        let body2 = {
          order_details: body.order_details,
          userId: decodedToken.userID,
          products,
        };
        const newOrder = new OrderModel({
          ...body2,
          adminsId,
          total,
          onlinePaymentDetails,
        });
        await newOrder.save();
        const cart = await CartModel.findOne({ userId: decodedToken.userID });

        if (!cart) return { status: "fail", message: "Cart not found" };
        await cart.deleteOne({ userId: decodedToken.userID });

        // cart.products = [];
        // await cart.save();
        return {
          status: "success",
          message: "Order Created",
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handlegetOrdersForUser(userId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      try {
        let orders = await OrderModel.find({ userId: userId });
        return {
          status: "success",
          orders,
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handledeleteSpecificOrder(orderId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      try {
        const order = await OrderModel.findOneAndDelete({ _id: orderId });
        if (!order) {
          return {
            status: "fail",
            message: "order not found",
          };
        }
        for (let i = 0; i < order.products.length; i++) {
          await ProductModel.updateOne(
            { _id: order.products[i]._id },
            {
              $inc: {
                sold: -order.products[i].quantity,
                quantity: order.products[i].quantity,
              },
            }
          );
        }
        const remainingOrders = await OrderModel.find({
          userId: decodedToken.userID,
        });
        return {
          status: "success",
          message: "order deleted",
          remainingOrders,
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleDeletetAllOrder(userId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      try {
        const orders = await OrderModel.find({ userId: userId });
        for (let order of orders) {
          for (let product of order.products) {
            await ProductModel.updateOne(
              { _id: product._id },
              { $inc: { quantity: product.quantity, sold: -product.quantity } }
            );
          }
        }
        const result = await OrderModel.deleteMany({ userId: userId });
        if (result.deletedCount > 0) {
          return {
            status: "success",
            message: "order deleted",
          };
        } else {
          return {
            status: "fail",
            message: "order not found",
          };
        }
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleComplateOrder(orderId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "admin") {
      try {
        const order = await OrderModel.findOneAndDelete({ _id: orderId });
        const allOrder = await OrderModel.find({});

        if (order?.id) {
          const custometFound = await CustomerModel.findOne({
            userId: order.userId,
          });
          const userDetails = await UserModel.findOne({ _id: order.userId });
          if (custometFound?._id) {
            await CustomerModel.updateOne(
              { userId: order.userId },
              { $push: { orders: order } }
            );
          } else {
            const newCustomer = new CustomerModel({
              orders: order,
              adminsId: order.adminsId,
              userDetails,
            });
            await newCustomer.save();
          }
          return {
            status: "success",
            orders: allOrder,
          };
        } else {
          return {
            status: "fail",
            message: "order not found",
          };
        }
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleGetOrderForAdmin(adminId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "admin") {
      try {
        let orders = await OrderModel.find({ adminsId: adminId });
        return {
          status: "success",
          orders,
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
}
