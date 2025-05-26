import jwt from "jsonwebtoken";
import { IProduct } from "../interface/product";
import ProductModel from "../model/product";

export default class ProductService {
  constructor() {}
  async handleGetAllProducts() {
    try {
      let products = await ProductModel.find({});
      return {
        status: "succes",
        products,
      };
    } catch (errors) {
      return {
        status: "fail",
        errors,
      };
    }
  }
  async handleGetSpecificProduct(id: string) {
    try {
      let product = await ProductModel.find({ _id: id });

      if (product.length > 0) {
        return {
          status: "succes",
          product,
        };
      } else {
        return {
          status: "fail",
          message: "product not found",
        };
      }
    } catch (errors) {
      return {
        status: "error",
        errors,
      };
    }
  }
  async handleAddProduct(body: IProduct, token: string, filenames: string[]) {
    try {
      let tokenPart = token.split(" ")[1];
      let decodedToken = jwt.verify(
        tokenPart,
        process.env.TOKEN_SECRET as string
      ) as { role: string; userID: string };

      if (decodedToken.role !== "admin") {
        return {
          status: "Error",
          message: "You are not authorized to access this resource!",
        };
      }

      body.images = [...filenames];

      let newProduct = new ProductModel({
        ...body,
        imageCover: filenames[0],
        adminId: decodedToken.userID,
        category: { name: body.category },
        createdAt: new Date(),
      });

      await newProduct.save();
      return {
        status: "success",
        message: "product Added",
        data: newProduct,
      };
    } catch (err) {
      return {
        status: "error",
        message: err,
      };
    }
  }
  async handleDeleteProduct(id: string) {
    try {
      await ProductModel.deleteOne({ _id: id });
      return {
        status: "succes",
        message: "prodect Deleted Successfully",
      };
    } catch (errors) {
      return {
        status: "error",
        message: errors,
      };
    }
  }
  // async handleUpdateProduct(body: IProduct, id: string) {
  //   console.log(body);

  //   try {
  //     let product = await ProductModel.findByIdAndUpdate(
  //       id,
  //       { ...body, category: { name: body.category }, updatedAt: new Date() },
  //       {
  //         new: true,
  //         runValidators: true,
  //       }
  //     );
  //     if (product) {
  //       return {
  //         status: "success",
  //         product,
  //       };
  //     } else {
  //       return {
  //         status: "fail",
  //         message: "Product Not Found",
  //       };
  //     }
  //   } catch (errors) {
  //     return {
  //       status: "error",
  //       errors,
  //     };
  //   }
  // }

  async handleUpdateProduct(body: any, id: string, filenames: string[]) {
    try {
      console.log("filenames", filenames);
      body.images = filenames;
      body.imageCover = filenames[0];
      let product = await ProductModel.findByIdAndUpdate(
        id,
        {
          ...body,

          category: { name: body.category },
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (product) {
        return {
          status: "success",
          product,
        };
      } else {
        return {
          status: "fail",
          message: "Product Not Found",
        };
      }
    } catch (err) {
      return {
        status: "error",
        message: err,
      };
    }
  }
}
