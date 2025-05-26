import mongoose from "mongoose";
import { IProduct } from "../interface/product";
import { array } from "joi";

let schema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [2, "Title must be at least 2 characters."],
    required: [true, "Title must be at least 2 characters."],
  },
  sold: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Description is required and cannot be empty"],
  },
  quantity: {
    type: Number,
    min: [0, "Quantity cannot be negative."],
    required: [true, "Quantity cannot be negative."],
  },
  price: {
    type: Number,
    min: [0, "Price must be a positive number."],
    required: [true, "Price must be a positive number."],
  },
  imageCover: {
    type: String,
  },

  images: {
    type: [String],
    required: [true, "You must upload at least one image"],
    validate: {
      validator: function (val: any) {
        return Array.isArray(val) && val.length > 0;
      },
      message: "Images array must contain at least one image",
    },
  },
  // category: {
  //   type: Object,
  //   required: [
  //     function (this: any) {
  //       return (
  //         this.category &&
  //         typeof this.category.name === "string" &&
  //         this.category.name.trim().length > 0
  //       );
  //     },
  //     "Category is required and cannot be empty",
  //   ],
  // },
  // images: {
  //   type: [String],
  //   required: [true, "must upload one image at least"],
  // },
  category: {
    type: Object,
    required: [true, "Category is required"],
  },
  brand: {
    type: Object,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, "Rating must be at least 0."],
    max: [5, "Rating cannot exceed 5."],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  adminId: {
    type: String,
    required: true,
  },
  isWachList: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  Comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      // userName: {
      //   type: String,
      //   required: true,
      // },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      // avatar: {
      //   type: String,
      //   default: "profile.png",
      // },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

schema.pre("validate", function (next) {
  if (
    !this.category ||
    typeof this.category.name !== "string" ||
    this.category.name.trim().length === 0
  ) {
    this.invalidate("category", "Category is required and cannot be empty");
  }
  next();
});

let ProductModel = mongoose.model<IProduct>("product", schema);

export default ProductModel;
