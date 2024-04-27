import {uuidv4} from "uuid";
function generateTransactionId() {
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const transactionId = `${timestamp}-${uniqueId}-${randomNum}`;
    return transactionId;
}


export default generateTransactionId;