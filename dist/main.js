"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ debug: true });
const path = require("path");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const produtc_1 = __importDefault(require("./routes/produtc"));
const categories_1 = __importDefault(require("./routes/categories"));
const order_1 = __importDefault(require("./routes/order"));
const dashboardRouter_1 = __importDefault(require("./routes/dashboardRouter"));
const cart_1 = __importDefault(require("./routes/cart"));
const customer_1 = __importDefault(require("./routes/customer"));
const wishList_1 = __importDefault(require("./routes/wishList"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;
mongoose_1.default
    .connect(MONGOURL)
    .then(() => {
    console.log("mongodb Connected");
})
    .catch(() => console.log("failed", process.env.MONGOURL));
// Meddileware
app.use("/api/auth", user_1.default);
app.use("/api", feedback_1.default);
app.use("/api", produtc_1.default);
app.use("/api", categories_1.default);
app.use("/api", order_1.default);
app.use("/api", dashboardRouter_1.default);
app.use("/api", cart_1.default);
app.use("/api", customer_1.default);
app.use("/api", wishList_1.default);
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
