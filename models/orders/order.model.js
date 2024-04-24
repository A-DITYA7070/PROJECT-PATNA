import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    orderNumber:{
        type:String,
        required:true
    },
    orderedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            product:{
                type:mongoose.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'Pending'
    },
    address:{
        type:mongoose.Types.ObjectId,
        ref:"Address"
    }
},{
    timestamps:true
});

export const Order = mongoose.model("Order",orderSchema);