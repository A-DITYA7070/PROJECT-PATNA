import { catchAsyncError } from "../errors/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/accounts/user.model.js";
import { Seller } from "../../models/accounts/seller.model.js";
import { Manager } from "../../models/accounts/manager.model.js";
import { Admin } from "../../models/accounts/admin.model.js";


const validateOldToken = (user,time) => {
    const session = user.sessionToken;
    const sessionDate = new Date(session);
    const timestamp = sessionDate.getTime();
    if(time !== timestamp ){
        return "unauthorised";
    }
    return "validated";
}


/**
 * Middleware function to check which user is authenticated or not this is usefull because 
 * we dont need to verify the user everytime.
 */
export const isAuthenticated = catchAsyncError(async(req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource ",401));
    }

    
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const role = decoded.role;
    const time = decoded.date;
    

    if(role === "user"){
        const user=await User.findById(decoded._id);
        const validate = validateOldToken(user,time);
        if(validate === "unauthorised"){
            return next(new ErrorHandler("UnAuthorised ",401));
        }
        req.user = user;  
    }

    if(role === "seller"){
        const seller = await Seller.findById(decoded._id);
        const validate = validateOldToken(seller,time);
        if(validate === "unauthorised"){
            return next(new ErrorHandler("UnAuthorised ",401));
        }
        req.user = seller;
    
    }

    if(role === "manager"){
        const manager = await Manager.findById(decoded._id);
        const validate = validateOldToken(manager,time);
        if(validate === "unauthorised"){
            return next(new ErrorHandler("UnAuthorised ",401));
        }
        req.user = manager;
    }

    if(role === "admin"){
        const userAdmin = await Admin.findById(decoded._id);
        const validate = validateOldToken(userAdmin,time);
        if(validate === "unauthorised"){
            return next(new ErrorHandler("UnAuthorised hai ",401));
        }
        req.user = userAdmin;
    }
    
    next();
});


/**
 * Middleware to check whether the user is admin or not.
 */
export const isAdmin = catchAsyncError(async(req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource ",401));
    }
    
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    
    const role = decoded.role;
    if(role !== "admin"){
        return next(new ErrorHandler("UnAuthorised ",401));
    }
    next();
})








