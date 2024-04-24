import express from "express";
import {
    createProduct,
    getApprovedProducts,
} from "../../controllers/products/product.controller.js";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { verifySellerToken } from "../../middlewares/auth/seller.middleware.js";



const router = express.Router();


router.route("/new").post(isAuthenticated,verifySellerToken,createProduct);
router.route("/").get(isAuthenticated,getApprovedProducts);


export default router;