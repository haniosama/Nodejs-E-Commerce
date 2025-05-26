  import { Types } from "mongoose";

  export interface ICart {
    userId: string | Types.ObjectId; // ID of the user owning the cart
    products: ICartProduct[]; // Array of products in the cart
    createdAt: Date; // Timestamp for when the cart was created
    updatedAt: Date; // Timestamp for when the cart was last updated
    discount?: number; // ⬅️ أضف دي هنا
  }

  export interface ICartProduct {
    productId: string | Types.ObjectId; // ID of the product in the cart
    quantity: number; // Quantity of the product in the cart
    price: number; // سعر المنتج
  }
