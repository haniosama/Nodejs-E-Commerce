import { Router } from "express";
import CategoriesService from "../service/category";
import CategoriesControl from "../control/category";

let router = Router();
let categoriesService = new CategoriesService();
let categoriesControl = new CategoriesControl(categoriesService);
router.get("/categories", (req, res) =>
  categoriesControl.getAllService(req, res)
);
router.get("/categoriesForAdmin", (req, res) =>
  categoriesControl.getetCatogriesForAdmin(req, res)
);
router.get("/categories/:name", (req, res) =>
  categoriesControl.getSpecificCategory(req, res)
);
router.post("/categories", (req, res) =>
  categoriesControl.addcategory(req, res)
);
router.delete("/categories/:categoryName", (req, res) =>
  categoriesControl.deleteCategory(req, res)
);

export default router;
