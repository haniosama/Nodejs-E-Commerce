import express from "express";
import verifyToken from "../middleware/verifyToken";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../service/wishList";

const router = express.Router();

router.post("/wishlist/:productId", verifyToken, async (req, res) => {
  try {
    const updatedUser = await addToWishlist(
      req.user.userID,
      req.params.productId
    );
    res.json({ message: "Added to wishlist", wishlist: updatedUser.wishlist });
  } catch (err) {
    res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
});

router.delete("/wishlist/:productId", verifyToken, async (req, res) => {
  try {
    const updatedUser = await removeFromWishlist(
      req.user.userID,
      req.params.productId
    );
    res.json({
      message: "Removed from wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (err) {
    res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
});

router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const wishlist = await getWishlist(req.user.userID);
    res.json({ wishlist });
  } catch (err) {
    res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
});

export default router;
