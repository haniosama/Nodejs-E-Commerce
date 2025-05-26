import CartModel from "../model/cart";
import ProductModel from "../model/product";
import jwt from "jsonwebtoken";
import CouponModel from "../model/coupon"; 


export default class CartService {
async handleAddToCart(productId: string, userId: string) {
  const product = await ProductModel.findById({_id:productId});
  if (!product) return { status: "fail", message: "Product not found" };
  let userCart = await CartModel.findOne({ userId });
  console.log("userCart",userCart);
  if (userCart) {
    const existingProduct = userCart.products.find(
      (p: any) => p.productId.toString() === productId
    );
    if (existingProduct) {
      return { status: "fail", message: "Product already in cart" };
    }
    userCart.products.push({
      productId,
      quantity: 1,
      price: Number(product.price),
    });
    await userCart.save();
  }
  if (!userCart) {
    userCart = await CartModel.create({
      userId,
      products: [
        {
          productId,
          quantity: 1,
          price: Number(product.price), 
        },
      ],
    });
  }
  return { status: "success", message: "Product added to cart", cart: userCart };
}





// Get user cart
async handleGetCart(userId: string) {
  const cart = await CartModel.findOne({ userId }).populate({
    path: "products.productId",
    model: "product", 
  });
  if (!cart) {
    return { status: "fail", message: "Cart is empty" };
  }
  return { status: "success", cart };
}




  // Remove product from cart
  async handleRemoveProduct(userId: string, productId: string) {
  const cart = await CartModel.findOne({ userId });
  if (!cart) return { status: "fail", message: "Cart not found" };
  const initialLength = cart.products.length;
  cart.products = cart.products.filter(
    (p: any) => p.productId.toString() !== productId
  );
  if (cart.products.length === initialLength) {
    return { status: "fail", message: "Product not in cart" };
  }
  await cart.save();
  return { status: "success", message: "Product removed", cart };
}




  // Update product quantity in cart
async handleUpdateQuantity(userId: string, productId: string, quantity: number) {
  if (quantity < 1) {
    return { status: "fail", message: "Quantity must be at least 1" };
  }
  const cart = await CartModel.findOne({ userId });
  if (!cart) return { status: "fail", message: "Cart not found" };
  const productInCart = cart.products.find(
    (p: any) => p.productId.toString() === productId
  );
  if (!productInCart) {
    return { status: "fail", message: "Product not found in cart" };
  }
  productInCart.quantity = quantity;
  await cart.save();
  return { status: "success", message: "Quantity updated", cart };
}





  // Clear all products from cart
async handleClearCart(userId: string) {
  const deletedCart = await CartModel.findOneAndDelete({ userId });
  if (!deletedCart) {
    return { status: "fail", message: "Cart not found" };
  }
  return { status: "success", message: "Cart deleted completely" };
}



  // Apply coupon to cart
async applyCoupon(userId: string, code: string) {
  try {
    const coupon = await CouponModel.findOne({ code });

    if (!coupon) {
      return { status: "fail", message: "Invalid coupon code." };
    }

    if (coupon.expiresAt < new Date()) {
      return { status: "fail", message: "Coupon has expired." };
    }

    const cart = await CartModel.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return { status: "fail", message: "Cart not found." };
    }

    const discountAmount = cart.products.reduce((total, item) => {
      const productPrice = (item.productId as any).price; 
      return total + item.quantity * productPrice;
    }, 0) * 0.2; 

    cart.discount = discountAmount;

    await cart.save();

    return {
      status: "success",
      message: "Coupon applied successfully.",
      data: {
        discountAmount,
        totalAfterDiscount: cart.products.reduce((total, item) => {
          const productPrice = (item.productId as any).price;
          return total + item.quantity * productPrice;
        }, 0) - discountAmount,
      },
    };
  } catch (error) {
    console.error(error);
    return { status: "fail", message: "Something went wrong." };
  }
}

}




