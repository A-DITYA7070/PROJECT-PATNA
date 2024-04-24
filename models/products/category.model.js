import mongoose,{Schema} from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is required "]
    },
    description:{
        type:String,
        required:[true,"Description of category is required "]
    }
},{timestamps:true});


export const Category = mongoose.model("Category",categorySchema);