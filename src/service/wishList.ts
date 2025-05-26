import UserModel from "../model/user";
import mongoose from "mongoose";

export const addToWishlist = async (userId: string, productId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.wishlist) user.wishlist = [];

  const productObjectId = new mongoose.Types.ObjectId(productId);

  if (user.wishlist.some((id) => id.equals(productObjectId))) {
    throw new Error("Product already in wishlist");
  }

  user.wishlist.push(productObjectId);
  await user.save();

  return user;
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.wishlist) return user;

  const productObjectId = new mongoose.Types.ObjectId(productId);

  user.wishlist = user.wishlist.filter((id) => !id.equals(productObjectId));

  await user.save();

  return user;
};

export const getWishlist = async (userId: string) => {
  const user = await UserModel.findById(userId).populate("wishlist");
  if (!user) throw new Error("User not found");

  return user.wishlist;
};
