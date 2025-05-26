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
}
