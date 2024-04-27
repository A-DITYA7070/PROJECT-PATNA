import mongoose , {Schema} from "mongoose";


const deliverySchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    orderNo:{
        type:String,
        required:[true,"Order Number is required"]
    },
    status:{
        type:String,
        enum:["SHIPPED","DELIVERED"],
        required:[true,"Status is required"]
    },
    buyerId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }


});


export const Delivery = new mongoose.model("Delivery",deliverySchema);