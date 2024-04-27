
import express from "express";


const router = express.Router();

import User from "./accounts/user.route.js";
import Admin from "./accounts/admin.route.js";
import Category from "./products/category.route.js";
import SubCategory from "./products/subCategory.js";
import Seller from "./accounts/seller.route.js";
import Product from "./products/product.route.js";
import Manager from "./accounts/manager.route.js";
import Order from "./orders/order.route.js";


router.use("/users",User);
router.use("/admin",Admin);
router.use("/",Category);
router.use("/",SubCategory);
router.use("/seller",Seller);
router.use("/product",Product);
router.use("/manager",Manager);
router.use("/order",Order);


export default router;

