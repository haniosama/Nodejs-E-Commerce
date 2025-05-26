export interface IOrder {
  _id?: string;
  order_details: {
    address: string;
    phone: string;
  };
  userId: string;
  userName: string;
  products: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    productId:{
      price:number,
      adminId?: string;
      _id:string;
    }
  }[];
  adminsId: string[]; // ✅ أضف هذا السطر
  total: number;
}
