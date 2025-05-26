import { IFeedback } from "../interface/feedback";
import fs from "fs"
import path from "path"
import * as XLSX from 'xlsx' 
export default class FeedBackService{
    constructor(){}


    handleCreateFeedback(body:IFeedback){
        try{
            let filePah=path.join(__dirname,"..","data",'feedback.xlsx');
            if(filePah){
    
                let dir=path.dirname(filePah)
                if(!dir){
                    fs.mkdirSync(dir,{recursive:true})
                }
                let workBook;
                let workSheet;
    
    
                if(fs.existsSync(filePah)){
                    workBook=XLSX.readFile(filePah);
                    workSheet=workBook.Sheets[workBook.SheetNames[0]];
    
                    let data=XLSX.utils.sheet_to_json(workSheet);
                    data.push(body);
                    workSheet=XLSX.utils.json_to_sheet(data);
    
                    workBook.Sheets[workBook.SheetNames[0]]=workSheet
                }else{
                    workSheet=XLSX.utils.json_to_sheet([body]);
                    workBook=XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workBook,workSheet,'Feedback')
                }
                XLSX.writeFile(workBook,filePah);
            }
            return {
                status:'success',
                message:"We will reply to you soon."
            };
        }
        catch(err){
            return {
                status:'fail',
                message:err
            };
        }
    }
}