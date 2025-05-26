import { Request, Response } from "express";
import FeedBackService from "../service/feedback";

export default class FeedBackControls{
    constructor(private feedBackService:FeedBackService){

    }

    createFeedBack(req:Request,res:Response){
        let body=req.body
        let resSer=this.feedBackService.handleCreateFeedback(body)
        console.log(resSer)
        if(resSer.status === 'fail'){
            res.status(400).json(resSer)
        }else{
            res.status(200).json(resSer)
        }
    }
}