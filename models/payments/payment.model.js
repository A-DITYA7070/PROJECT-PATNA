import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({
    orderId:{
        type:mongoose.Types.ObjectId,
        ref:"Order"
    },
    transanctionId:{
        type:String,
        required:true
    },
    paymentMode:{
        type:String,
        enum:["COD","NETBANKING","UPI"],
        required:true
    },
    paidBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    amountPaid:{
        type:Number,
        required:true
    },



},{
    timestamps:true
})

export const Payment = new mongoose.model("Payment",paymentSchema);