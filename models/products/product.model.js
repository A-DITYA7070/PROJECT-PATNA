import mongoose,{Schema} from "mongoose";


const productSchema = new Schema({
    name:{
        type:String,
        required:[true,"Enter the product name "]
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    subCategory:{
        type:mongoose.Types.ObjectId,
        ref:"subCategory",
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    price:{
        type:Number,
        required:true,
    },
    mrp:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"Seller"
    },
    soldOut:{
        type:Boolean,
        default:false
    },
    stock:{
        type:Number,
        default:0,
    },
    quantity:{
        type:String
    },
    unit:{
        type:String,
        enum:["kg","litre","piece"],
        required:true
    },
    reviews:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User",
            rating:String,
            comments:[]
        }
    ],
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
            isVerified:{
                type:Boolean,
                default:false
            }
        }
    ],
    seller:{
        type:mongoose.Types.ObjectId,
        ref:"Seller",
        required:true
    }

},{timestamps:true});




export const Product = mongoose.model("Product",productSchema);