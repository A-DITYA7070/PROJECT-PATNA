import ErrorHandler from "../../utils/errorHandler.js";
import { Admin } from "../../models/accounts/admin.model.js";



export const verifyAdminToken = async(req,res,next) => {
    const userId = req.user.id;
    const {admin} = req.cookies;
    if(!admin){
        return next(new ErrorHandler("Invalid csrf token "));
    }
    const adminuser = await Admin.findById(userId);
    const storedAdminCookie = adminuser.adminCookie;
    if(!storedAdminCookie || storedAdminCookie !== admin){
        return next(new ErrorHandler("UnAuthorised-admin ",401));
    }

    next();
}


// export const authoriseAdmin = async(req,res,next) => {
//     const id = req.user.id;
//     const admin = await Admin()
// }