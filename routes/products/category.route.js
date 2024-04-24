import express from "express";
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories,
    getCategory,
    updateCategory
} from "../../controllers/products/category.controller.js";
import { isAdmin, isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { sendCsrfToken, verifyCsrfToken } from "../../middlewares/auth/csrf.middleware.js";
import { verifyAdminToken } from "../../middlewares/auth/admin.middleware.js";


const router = express.Router();


router.route("/admin/category/new").post(isAuthenticated,verifyAdminToken,createCategory);
router.route("/category").get(isAuthenticated,getAllCategories);
router.route("/category/:id").get(isAuthenticated,getCategory);
router.route("/admin/category/:id").patch(isAuthenticated,verifyAdminToken,updateCategory);
router.route("/admin/category/:id").delete(isAuthenticated,verifyAdminToken,deleteCategory);


export default router;