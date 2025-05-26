const path = require("path");
import Router from "express";
import ProductService from "../service/product";
import ProductControl from "../control/product";
import verifyToken from "../middleware/verifyToken";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

let router = Router();

// const diskStorage = multer.diskStorage({
//   destination: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const dest = path.join(__dirname, "../uploads");
//     console.log(dest);

//     cb(null, dest);
//   },
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `user-${Date.now()}${Math.random()*1000}.${ext}`;
//     cb(null, fileName);
//   },
// });

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    cb(null, true);
  } else {
    cb(new Error("File must be an image"));
  }
};

const upload = multer({
  // storage: diskStorage,
  storage: multer.memoryStorage(),
  fileFilter,
});

let productService = new ProductService();
let productControl = new ProductControl(productService);

router.get("/products", (req, res) => productControl.getAllProduct(req, res));
router.get("/product/:id", (req, res) =>
  productControl.getSpecificProduct(req, res)
);
router.post("/product", upload.array("images", 5), verifyToken, async (req, res, next) => {
  try {
    await productControl.addProduct(req, res);
  } catch (err) {
    next(err);
  }
});
router.patch("/product/:id", upload.array("images", 5), verifyToken, async (req, res, next) => {
  try {
    await productControl.updateProduct(req, res);
  } catch (err) {
    next(err);
  }
});
router.delete("/product/:id", verifyToken, (req, res) =>
  productControl.deleteProduct(req, res)
);
// Comments
router
  .route("/product/comment/:id")
  .post(verifyToken, productControl.addComment)
  .get(verifyToken, productControl.getAllComments);

router
  .route("/product/comment/:id/:commentId")
  .patch(verifyToken, productControl.updateComment)
  .delete(verifyToken, productControl.deleteComment);
export default router;
