import mongoose,{Schema} from "mongoose";


const subCategorySchema = new Schema({
    name:{
        type:String,
        required:[true,"Name of subcategory is required "]
    },
    description:{
        type:String,
        required:[true,"Description is required "]
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"Category"
    }
},{timestamps:true});


export const Subcategory = mongoose.model("SubCategory",subCategorySchema);