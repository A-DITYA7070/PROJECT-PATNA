import express from "express";
import { isAdmin, isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { 
    createSubCategory, 
    deleteSubCategory, 
    getSubCategories,
    getSubCategory,
    updateSubCategory
} from "../../controllers/products/subCategory.js";
import { sendCsrfToken, verifyCsrfToken } from "../../middlewares/auth/csrf.middleware.js";

const router = express.Router();

router.route("/admin/sub-category/new").post(isAuthenticated,isAdmin,createSubCategory);
router.route("/sub-categories").get(isAuthenticated,getSubCategories);
router.route("/sub-category/:id").get(isAuthenticated,getSubCategory);
router.route("/admin/sub-category/:id").patch(isAuthenticated,isAdmin,sendCsrfToken,verifyCsrfToken,updateSubCategory);
router.route("/admin/sub-category/:id").delete(isAuthenticated,isAdmin,deleteSubCategory);


export default router;


