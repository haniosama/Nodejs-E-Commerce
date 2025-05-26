import { Comment } from "./../interface/product";
import { Request, Response } from "express";
import ProductService from "../service/product";
import { IProduct } from "../interface/product";
import ProductModel from "../model/product";
import UserModel from "../model/user";
import cloudinary from "../service/cloudinary";
// import cloudinary from "../config/cloudinary";

export default class ProductControl {
  constructor(private productService: ProductService) {}

  async getAllProduct(req: Request, res: Response) {
    let resSer = await this.productService.handleGetAllProducts();
    if (resSer.status === "fail") {
      res.status(500).json(resSer);
    } else {
      res.status(200).json(resSer);
    }
  }
  async getSpecificProduct(req: Request, res: Response) {
    let id = req.params.id;
    let resSer = await this.productService.handleGetSpecificProduct(id);
    if (resSer.status === "fail") {
      res.status(404).json(resSer);
    } else if (resSer.status == "error") {
      res.status(500).json(resSer);
    } else {
      res.status(200).json(resSer);
    }
  }

  async addProduct(req: Request, res: Response) {
    let body = req.body;
    let token = req.headers["authorization"] as string;
    let filenames: string[] = [];

    try {
      if (Array.isArray(req.files)) {
        const uploadPromises = (req.files as Express.Multer.File[]).map(
          (file) => {
            return new Promise<string>((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    folder: "products",
                  },
                  (error, result) => {
                    if (error) return reject(error);
                    if (result?.secure_url) resolve(result.secure_url);
                    else reject("No URL returned from Cloudinary");
                  }
                )
                .end(file.buffer);
            });
          }
        );

        filenames = await Promise.all(uploadPromises);
      }

      let resSer = await this.productService.handleAddProduct(
        body,
        token,
        filenames
      );

      if (resSer.status === "error") {
        return res.status(500).send(resSer);
      }

      res.status(200).send(resSer);
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "error", message: "Image upload failed" });
    }
  }

  // async addProduct(req: Request, res: Response) {
  //   let body = req.body;
  //   let token = req.headers["authorization"] as string;
  //   console.log(req.files);

  //   // Extract filenames from req.files
  //   let filenames: string[] = [];
  //   if (Array.isArray(req.files)) {
  //     filenames = req.files.map((file: any) => file.filename);
  //   } else if (req.files && typeof req.files === "object") {
  //     filenames = Object.values(req.files)
  //       .flat()
  //       .map((file: any) => file.filename);
  //   }

  //   let resSer = await this.productService.handleAddProduct(
  //     body,
  //     token,
  //     filenames
  //   );

  //   if (resSer.status == "error") {
  //     res.status(500).send(resSer);
  //   } else {
  //     res.status(200).send(resSer);
  //   }
  // }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    let id = req.params.id;

    if (req.user.role !== "admin") {
      res.status(403).send({
        status: "Error",
        message: "You are not authorized to access this resource!",
      });
      return;
    }

    const product = await this.productService.handleGetSpecificProduct(id);
    const productList = product.product as IProduct[];

    if (!productList || productList.length === 0) {
      res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
      return;
    }

    if (productList[0]?.adminId?.toString() !== req.user.userID) {
      res.status(401).send({
        status: "Error",
        message: "You are not authorized to delete this product",
      });
      return;
    }

    const deleteRes = await this.productService.handleDeleteProduct(id);

    if (deleteRes.status == "error") {
      res.status(500).send(deleteRes);
    } else {
      res.status(200).send(deleteRes);
    }
  }

  // async updateProduct(req: Request, res: Response) {
  //   let id = req.params.id;

  //   let filenames: string[] = [];

  //   if (Array.isArray(req.files) && req.files.length > 0) {
  //     filenames = req.files.map((file: any) => file.filename);
  //   } else if (
  //     req.files &&
  //     typeof req.files === "object" &&
  //     Object.keys(req.files).length > 0
  //   ) {
  //     filenames = Object.values(req.files)
  //       .flat()
  //       .map((file: any) => file.filename);
  //   } else {
  //     const product = await this.productService.handleGetSpecificProduct(id);
  //     const productList = product.product as IProduct[];

  //     if (!productList || productList.length === 0) {
  //       res.status(404).send({
  //         status: "Error",
  //         message: "Product not found",
  //       });
  //       return;
  //     }

  //     filenames = productList[0].images || [];
  //   }

  //   if (req.user.role !== "admin") {
  //     res.status(403).send({
  //       status: "Error",
  //       message: "You are not authorized to access this resource!",
  //     });
  //     return;
  //   }

  //   const product = await this.productService.handleGetSpecificProduct(id);
  //   const productList = product.product as IProduct[];

  //   if (!productList || productList.length === 0) {
  //     res.status(404).send({
  //       status: "Error",
  //       message: "Product not found",
  //     });
  //     return;
  //   }

  //   if (productList[0]?.adminId?.toString() !== req.user.userID) {
  //     res.status(401).send({
  //       status: "Error",
  //       message: "You are not authorized to delete this product",
  //     });
  //     return;
  //   }

  //   const body = req.body;

  //   const updateRes = await this.productService.handleUpdateProduct(
  //     body,
  //     id,
  //     filenames
  //   );

  //   if (updateRes.status == "error") {
  //     res.status(500).send(updateRes);
  //   } else if (updateRes.status == "fail") {
  //     res.status(404).send(updateRes);
  //   } else {
  //     res.status(200).send(updateRes);
  //   }
  // }

  async updateProduct(req: Request, res: Response) {
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).send({
        status: "Error",
        message: "You are not authorized to access this resource!",
      });
    }

    const product = await this.productService.handleGetSpecificProduct(id);
    const productList = product.product as IProduct[];

    if (!productList || productList.length === 0) {
      return res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
    }

    if (productList[0]?.adminId?.toString() !== req.user.userID) {
      return res.status(401).send({
        status: "Error",
        message: "You are not authorized to update this product",
      });
    }

    let filenames: string[] = [];

    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = (req.files as Express.Multer.File[]).map(
        (file) => {
          return new Promise<string>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "products" }, (error, result) => {
                if (error) return reject(error);
                if (result?.secure_url) resolve(result.secure_url);
                else reject("No URL returned from Cloudinary");
              })
              .end(file.buffer);
          });
        }
      );

      try {
        filenames = await Promise.all(uploadPromises);
      } catch (err) {
        return res.status(500).send({
          status: "Error",
          message: "Image upload failed",
          error: err,
        });
      }
    } else {
      filenames = productList[0].images || [];
    }

    const body = req.body;

    const updateRes = await this.productService.handleUpdateProduct(
      body,
      id,
      filenames
    );

    if (updateRes.status === "error") {
      return res.status(500).send(updateRes);
    } else if (updateRes.status === "fail") {
      return res.status(404).send(updateRes);
    } else {
      return res.status(200).send(updateRes);
    }
  }

  async addComment(req: Request, res: Response): Promise<void> {
    let productId = req.params.id;

    const Comment: Comment = {
      userId: req.user.userID,
      comment: req.body.comment,
      // userName: req.user.userName,
      createdAt: new Date(),
    };

    try {
      const updateRes = await ProductModel.findByIdAndUpdate(
        productId,
        {
          $push: { Comments: Comment },
          $set: { updatedAt: new Date() },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (updateRes) {
        res.status(200).json({
          status: "success",
          message: "Comment added successfully",
          data: updateRes,
        });
        return;
      } else {
        res.status(404).json({
          status: "fail",
          message: "Product not found",
        });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Error adding comment" });
      return;
    }
  }

  async getAllComments(req: Request, res: Response): Promise<void> {
    let productId = req.params.id;

    try {
      const product = await ProductModel.findById(productId).select("Comments");

      if (!product) {
        res.status(404).json({
          status: "fail",
          message: "Product not found",
        });
        return;
      } else {
        res.status(200).json({
          status: "success",
          data: product,
        });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    let commentId = req.params.commentId;
    let productId = req.params.id;
    let comment = req.body.comment;

    try {
      const product = await ProductModel.findById(productId);

      if (!product) {
        res.status(404).json({
          status: "fail",
          message: "Product not found",
        });
        return;
      }

      const commentsArray = Array.isArray(product.Comments)
        ? product.Comments
        : [];

      const commentToUpdate = commentsArray.find(
        (comment: any) => comment._id.toString() === commentId
      );

      if (!commentToUpdate) {
        res.status(404).json({
          status: "fail",
          message: "Comment not found",
        });
        return;
      }

      if (commentToUpdate.userId.toString() !== req.user.userID) {
        res.status(401).json({
          status: "fail",
          message: "You are not authorized to update this comment",
        });
        return;
      }

      commentToUpdate.comment = comment;
      commentToUpdate.updatedAt = new Date();

      await product.save();
      res.status(200).json({
        status: "success",
        message: "Comment updated successfully",
        data: product.Comments,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  }
  async deleteComment(req: Request, res: Response): Promise<void> {
    let commentId = req.params.commentId;
    let productId = req.params.id;

    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        res.status(404).json({
          status: "fail",
          message: "Product not found",
        });
        return;
      }

      const commentsArray = Array.isArray(product.Comments)
        ? product.Comments
        : [];

      const commentToDelete = commentsArray.find(
        (comment: any) => comment._id.toString() === commentId
      );
      if (!commentToDelete) {
        res.status(404).json({
          status: "fail",
          message: "Comment not found",
        });
        return;
      }

      if (commentToDelete.userId.toString() !== req.user.userID) {
        res.status(401).json({
          status: "fail",
          message: "You are not authorized to update this comment",
        });
        return;
      }

      const updatedComments = commentsArray.filter(
        (comment: any) => comment._id.toString() !== commentId
      );

      product.Comments = updatedComments;

      await product.save();

      res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
        data: product.Comments,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment" });
    }
  }
}
