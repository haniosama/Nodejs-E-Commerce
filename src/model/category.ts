import mongoose from "mongoose";
import { ICategory } from "../interface/category";

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: "https://placehold.co/300?text=Category",
  },
});

let CategoryModel = mongoose.model<ICategory>("category", schema);

export default CategoryModel;
