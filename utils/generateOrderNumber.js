import generateRandomToken from "./generateRandomToken.js";
import CryptoJS from "crypto-js";

const generateOrderNumber = () => {
    const randomText = generateRandomToken(10);
    const hashedText = CryptoJS.MD5(randomText).toString();
    return hashedText;
}

export default generateOrderNumber;