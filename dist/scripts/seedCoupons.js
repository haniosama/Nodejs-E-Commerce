"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coupon_1 = __importDefault(require("../model/coupon"));
function seedCoupons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // الاتصال بقاعدة البيانات
            yield mongoose_1.default.connect("mongodb+srv://m48162698:Cac52DYQm1SCvWUl@cluster0.rwjhcxe.mongodb.net/angularEcommarce?retryWrites=true&w=majority&appName=Cluster0");
            // قائمة بالكوبونات الجديدة
            const coupons = [
                {
                    code: "SALE30",
                    discount: 10,
                    expiresAt: new Date("2025-12-31"),
                },
                {
                    code: "SALE40",
                    discount: 20,
                    expiresAt: new Date("2025-12-31"),
                },
            ];
            // التحقق من وجود الكوبونات وتخطي الموجودة منها
            for (const coupon of coupons) {
                const existingCoupon = yield coupon_1.default.findOne({ code: coupon.code });
                if (!existingCoupon) {
                    yield coupon_1.default.create(coupon);
                    console.log(`Coupon ${coupon.code} seeded successfully.`);
                }
                else {
                    console.log(`Coupon ${coupon.code} already exists.`);
                }
            }
        }
        catch (err) {
            console.error("Error seeding coupons:", err);
        }
        finally {
            yield mongoose_1.default.disconnect();
        }
    });
}
seedCoupons();
