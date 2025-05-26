import mongoose from "mongoose";
import { ICustomer } from "../interface/customer";





const schema=new mongoose.Schema({
    orders:{
        type:Array,
        require:true
    },
    userDetails:{
        type:Object,
        require:true
    },
    adminsId:{
        type:Array,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
})

const CustomerModel= mongoose.model<ICustomer>("custome",schema)

export default CustomerModel;