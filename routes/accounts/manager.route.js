import { 
    register,
    login,
    logout,
    myProfile,
    getUnverifiedProducts,
    getUnverifiedProduct,
    approveProduct,
    getAllSellers,
    getSeller,
    approveSeller,
    deleteSeller,

} from "../../controllers/accounts/manager.controller.js";

import express from "express";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { verifyManagerToken } from "../../middlewares/auth/manager.middleware.js";
import { sendCsrfToken, verifyCsrfToken } from "../../middlewares/auth/csrf.middleware.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated,verifyManagerToken,myProfile);
router.route("/logout").get(isAuthenticated,verifyManagerToken,logout);
router.route("/unverified-products").get(isAuthenticated,verifyManagerToken,getUnverifiedProducts);
router.route("/unverified-product/:id").get(isAuthenticated,verifyManagerToken,getUnverifiedProduct);
router.route("/verify-product/:id").patch(isAuthenticated,verifyManagerToken,sendCsrfToken,verifyCsrfToken,approveProduct);
router.route("/sellers").get(isAuthenticated,verifyManagerToken,sendCsrfToken,verifyCsrfToken,getAllSellers);
router.route("/seller/:id").get(isAuthenticated,verifyManagerToken,sendCsrfToken,verifyCsrfToken,getSeller);

router.route("/approve-seller/:id")
.patch(isAuthenticated,verifyManagerToken,sendCsrfToken,verifyCsrfToken,approveSeller)
router.route("/seller/:id")
.delete(isAuthenticated,verifyManagerToken,sendCsrfToken,verifyCsrfToken,deleteSeller);


export default router;