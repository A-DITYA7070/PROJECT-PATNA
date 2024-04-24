import ErrorHandler from "../../utils/errorHandler.js";
import { Manager } from "../../models/accounts/manager.model.js";



export const verifyManagerToken = async(req,res,next) => {
    const userId = req.user.id;
    const {manager} = req.cookies;
    if(!manager){
        return next(new ErrorHandler("Invalid manager token "));
    }
    const manageruser = await Manager.findById(userId);
    const storedmanagerCookie = manageruser.managerCookie;
    if(!storedmanagerCookie || storedmanagerCookie !== manager){
        return next(new ErrorHandler("UnAuthorised-manager ",401));
    }

    next();
}