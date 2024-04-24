import express from "express";

const router = express.Router();

import { 
    login,
    logout,
    myProfile,
    register 
} from "../../controllers/accounts/admin.controller.js";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";
import { verifyAdminToken } from "../../middlewares/auth/admin.middleware.js";


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated,verifyAdminToken,logout);
router.route("/me").get(isAuthenticated,verifyAdminToken,myProfile);







export default router;