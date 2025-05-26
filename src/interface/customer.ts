import { IProduct } from "./product";

export interface ICustomer{
    products:IProduct[];
    adminsId:string[],
    userDetails:{},
    order_details:{
        address: string;
        phone: string;
    }
}