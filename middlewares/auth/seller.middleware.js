import ErrorHandler from "../../utils/errorHandler.js";
import { Seller } from "../../models/accounts/seller.model.js";
import { Admin } from "../../models/accounts/admin.model.js";
import { verifyAdminToken } from "./admin.middleware.js";


export const verifySellerToken = async(req,res,next) => {
    const userId = req.user.id;
    const {seller} = req.cookies;
   
    if(!seller){
        return next(new ErrorHandler("Invalid seller token "));
    }
    const selleruser = await Seller.findById(userId);
    const storedSellerCookie = selleruser.sellerCookie;
    if(!storedSellerCookie || storedSellerCookie !== seller){
        return next(new ErrorHandler("UnAuthorised-seller ",401));
    }

    next();
}