import mongoose,{Schema} from "mongoose";


const addressSchema = new Schema({
    street:{
        type:String,
        required:true
    },
    landMark:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    postalCode:{
        type:Number,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        default:"India"
    },
    phoneNumber:{
        type:Number,
        required:true,
        length:10
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    manualAddress:{
       type:String,
    },
    isDefault:{
        type:Boolean,
        required:false
    }

},{
    timestamps:true
});

export const Address = mongoose.model("Address",addressSchema);