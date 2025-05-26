import { Request, Response } from "express";
import products from "../model/product";
import UserModel from "../model/user";

const getAdminProducts = async (req: Request, res: Response) => {
  let allProducts = await products.find({});

  const adminProducts = allProducts.filter((product) => {
    if (product.adminId == req.user.userID) {
      return product;
    }
  });

  if (adminProducts.length === 0) {
    res.status(404).json({
      status: "fail",
      message: "No products found for this admin",
    });
    return;
  }

  try {
    res.status(200).json({
      status: "success",
      products: adminProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const getUserData = async (req: Request, res: Response) => {
  let userInfo = await UserModel.find({ _id: req.params.id });

  if (!userInfo) {
    res.status(404).json({
      status: "fail",
      message: "User Not found",
    });
    return;
  } else {
    res.status(200).json({
      status: "success",
      data: userInfo,
    });
  }
};

export { getAdminProducts, getUserData };
