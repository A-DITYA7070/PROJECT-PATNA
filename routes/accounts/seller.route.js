import { 
    register,
    login,
    logout,
    myProfile,
    processOrder,
    sendOrdertoDeliveryPartner,

} from "../../controllers/accounts/seller.controller.js";

import express from "express";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { verifySellerToken } from "../../middlewares/auth/seller.middleware.js";
import { sendCsrfToken, verifyCsrfToken } from "../../middlewares/auth/csrf.middleware.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated,verifySellerToken,myProfile);
router.route("/logout").get(isAuthenticated,verifySellerToken,logout);
router.route("/order/:id").patch(isAuthenticated,verifySellerToken,sendCsrfToken,verifyCsrfToken,processOrder);
router.route("/order/shipped/:id").patch(isAuthenticated,verifySellerToken,sendCsrfToken,verifyCsrfToken,sendOrdertoDeliveryPartner);


export default router;