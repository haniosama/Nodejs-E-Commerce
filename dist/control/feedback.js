"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeedBackControls {
    constructor(feedBackService) {
        this.feedBackService = feedBackService;
    }
    createFeedBack(req, res) {
        let body = req.body;
        let resSer = this.feedBackService.handleCreateFeedback(body);
        console.log(resSer);
        if (resSer.status === 'fail') {
            res.status(400).json(resSer);
        }
        else {
            res.status(200).json(resSer);
        }
    }
}
exports.default = FeedBackControls;
