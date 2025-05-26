import { Request, Response } from "express";
import CartService from "../service/cart";



export default class CartControl {
  constructor(private cartService: CartService) {}


  async addToCart(req: Request, res: Response) {
    const productId = req.body.productId;
   const result = await this.cartService.handleAddToCart(productId, req.user.userID);
    res.status(result.status === "success" ? 200 : 400).json(result);
  }



  async getUserCart(req: Request, res: Response) {
    const result = await this.cartService.handleGetCart(req.user.userID);
    res.status(result.status === "success" ? 200 : 400).json(result);
  }



  async updateQuantity(req: Request, res: Response) {
    const { productId, quantity } = req.body;
    const result = await this.cartService.handleUpdateQuantity(req.user.userID, productId, quantity);
    res.status(result.status === "success" ? 200 : 400).json(result);
  }


  async removeFromCart(req: Request, res: Response) {
    const productId = req.params.productId;
    const result = await this.cartService.handleRemoveProduct(req.user.userID, productId);
    res.status(result.status === "success" ? 200 : 400).json(result);
  }



  async clearCart(req: Request, res: Response) {
  const result = await this.cartService.handleClearCart(req.user.userID);
  res.status(result.status === "success" ? 200 : 400).json(result);
}

async applyCoupon(req: Request, res: Response) {
  const { code } = req.body;
  const result = await this.cartService.applyCoupon(req.user.userID, code);
  res.status(result.status === "success" ? 200 : 400).json(result);
}
}