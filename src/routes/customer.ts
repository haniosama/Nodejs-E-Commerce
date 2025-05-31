import { Router } from "express";
import CustomerService from "../service/customer";
import CustomeControler from "../control/customer";

const router=Router();


const customerService=new CustomerService();
const customeControler=new CustomeControler(customerService)

router.get("/customer/:adminId",(req,res)=>customeControler.getAllCustomerFormAdmin(req,res))
router.get("/customer",(req,res)=>customeControler.getAllCustomer(req,res))











export default router