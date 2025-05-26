import { Router } from "express";
import FeedBackControls from "../control/feedback";
import FeedBackService from "../service/feedback";

let router =Router();

let feedBackService=new FeedBackService()
let feedBackControls=new FeedBackControls(feedBackService)

router.post('/feedback',(req,res)=>feedBackControls.createFeedBack(req,res))

export default router;