import mongoose from "mongoose";
import CouponModel from "../model/coupon";

async function seedCoupons() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect("mongodb+srv://m48162698:Cac52DYQm1SCvWUl@cluster0.rwjhcxe.mongodb.net/angularEcommarce?retryWrites=true&w=majority&appName=Cluster0");

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
      const existingCoupon = await CouponModel.findOne({ code: coupon.code });
      if (!existingCoupon) {
        await CouponModel.create(coupon);
        console.log(`Coupon ${coupon.code} seeded successfully.`);
      } else {
        console.log(`Coupon ${coupon.code} already exists.`);
      }
    }

  } catch (err) {
    console.error("Error seeding coupons:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCoupons();
