import { 
    register,
    login,
    logout,
    myProfile,

} from "../../controllers/accounts/seller.controller.js";

import express from "express";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { verifySellerToken } from "../../middlewares/auth/seller.middleware.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated,verifySellerToken,myProfile);
router.route("/logout").get(isAuthenticated,verifySellerToken,logout);


export default router;