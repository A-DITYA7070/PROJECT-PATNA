import express from "express";
import { 
    addAddress,
    addToCart,
    deleteAddress,
    getAddress,
    getAllAddress,
    login,
    logout,
    makeDefaultAddress,
    myProfile,
    register, 
    removeFromCart, 
    updateAddress, 
    viewCart
} from "../../controllers/accounts/user.controller.js";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated,logout);
router.route("/me").get(isAuthenticated,myProfile);
router.route("/cart/:id").post(isAuthenticated,addToCart);
router.route("/cart").get(isAuthenticated,viewCart);
router.route("/cart/:id").patch(isAuthenticated,removeFromCart);
router.route("/address/new").post(isAuthenticated,addAddress);
router.route("/addresses").get(isAuthenticated,getAllAddress);
router.route("/address/:id")
.get(isAuthenticated,getAddress)
.patch(isAuthenticated,makeDefaultAddress)
.delete(isAuthenticated,deleteAddress);
router.route("/address/update/:id").patch(isAuthenticated,updateAddress);








export default router;


