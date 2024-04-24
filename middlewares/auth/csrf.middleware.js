import ErrorHandler from "../../utils/errorHandler.js";
import CryptoJS from "crypto-js";


// in-memory csrf store..

const csrfTokenStore = {};

function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    const hashedToken = CryptoJS.SHA512(token).toString();
    return hashedToken;
}


const csrfOptions = {
    httpOnly:true,
    secure:true,
}

export const sendCsrfToken = async (req,res,next) => {
    const token = generateRandomToken();
    const userId = req.user.id; 
    csrfTokenStore[userId] = token;
    res.cookie("csrf",token,csrfOptions);
    next();
}

export const verifyCsrfToken = async(req,res,next) => {
    const userId = req.user.id;
    const {csrf} = req.cookies;
    if(!csrf){
        return next(new ErrorHandler("Invalid csrf token "));
    }
    const storedCsrfToken = csrfTokenStore[userId];

    if (!storedCsrfToken || storedCsrfToken !== csrf) {
        return next(new ErrorHandler("Invalid CSRF token"));
    }

    next();
}