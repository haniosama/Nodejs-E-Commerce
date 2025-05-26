export interface IProduct {
  _id: string;
  title: Title;
  slug?: Slug;
  sold: number;
  description: Slug;
  quantity: Quantity;
  price: number;
  imageCover?: Slug;
  images?: string[];
  category: Slug;
  brand?: Slug;
  ratingsAverage?: RatingsAverage;
  ratingsQuantity?: RatingsQuantity;
  adminId?: AdminId;
  isWachList?: IsWachList;
  createdAt: CreatedAt;
  updatedAt: Slug;
  Comments?: Comment[];
}

interface CreatedAt {
  type: string;
  default: string;
}

interface IsWachList {
  type: string;
  required: boolean;
  default: boolean;
}

interface AdminId {
  type: string;
  required: boolean;
}

interface RatingsQuantity {
  type: string;
  default: number;
}

interface RatingsAverage {
  type: string;
  default: number;
  min: (number | string)[];
  max: (number | string)[];
}

interface Images {
  type: string[];
}

interface Quantity {
  type: string;
  min: (number | string)[];
}

interface Slug {
  type: string;
}

interface Title {
  type: string;
  minlength: (number | string)[];
}

// export interface ProductComment {
//   // productId: string;
//   Comments: Comment[];
// }
export interface Comment {
  userId: string;
  comment: string;
  userName?: string;
  createdAt: Date;
  avatar?: string;
  updatedAt?: Date;
}
