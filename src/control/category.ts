import { Request, Response } from "express";
import CategoriesService from "../service/category";

export default class CategoriesControl {
  constructor(private categoriesService: CategoriesService) {}

  async getAllService(req: Request, res: Response) {
    let resSer = await this.categoriesService.handleGetAllCategory();
    if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(200).send(resSer);
    }
  }

  async getSpecificCategory(req: Request, res: Response) {
    let name = req.params.name;
    let resSer = await this.categoriesService.handleSpecificCategory(name);
    if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(200).send(resSer);
    }
  }
  async addcategory(req: Request, res: Response) {
    let body = req.body;
    let resSer = await this.categoriesService.handleAddCategory(body);
    console.log(resSer);
    
    if (resSer.status == "fail") {
      res.status(404).send(resSer);
    } else {
      res.status(201).send(resSer);
    }
  }

}
