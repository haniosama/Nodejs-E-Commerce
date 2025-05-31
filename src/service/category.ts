import  jwt  from 'jsonwebtoken';
import CategoryModel from "../model/category";
import ProductModel from "../model/product";

export default class CategoriesService {
  async handleGetAllCategory() {
    try {
      let categories = await CategoryModel.find();
      return {
        status: "success",
        data: categories,
      };
    } catch (err) {
      return {
        status: "fail",
        message: err,
      };
    }
  }
  async handleSpecificCategory(name: string) {
    try {
      let category = await ProductModel.find({ "category.name": name });
      return {
        status: "success",
        category,
      };
    } catch (err) {
      return {
        status: "fail",
        message: err,
      };
    }
  }
  async handleAddCategory(body: any) {
    try {
      const newCategory = new CategoryModel({ ...body });

        console.log(newCategory);
        
      await newCategory.save();

      return {
        status: "success",
        data: newCategory,
      };
    } catch (err) {
      return {
        status: "fail",
        message: err,
      };
    }
  }
  async handleGetgatogriesForAdmin(token:string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    try {
      const categoriesNames=await ProductModel.find<{name:string}[]>({adminId:decodedToken.userID}).distinct("category.name");
      console.log(categoriesNames)
      const categories = await CategoryModel.find({name:{$in:categoriesNames}}).select("name image _id")
      console.log(categories,"kkkkkkkkkkkkk")
      return {
        status: "success",
        data: categories,
      };
    } catch (err) {
      return {
        status: "fail",
        message: err,
      };
    }
  }
  async handleDeleteCategory(categoryName:string,token:string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == 'user') {
      return {
        status: 'fail',
        message: 'Unauthorized: Only admins can delete categories',
      };
    }
    try {
      await ProductModel.deleteMany({adminId:decodedToken.userID,'category.name':categoryName});
      return {
        status: "success",
        data: "Category Deleted",
      };
    } catch (err) {
      return {
        status: "fail",
        message: err,
      };
    }
  }

}

