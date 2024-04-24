import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Schema } from "mongoose";


const managerSchema = new Schema({
    name:{
        type:String,
        required: [true,"Please enter your name "],
        minLength: [2,"Name must be atleast 2 characters long "],
        maxLength: [30,"Name length can not be greater than 30 "],
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:[true,"Please enter your email "],
        unique:[true,"Email already exists "],
        lowercase:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:[true,"Phone Number is Required "],
        unique:[true,"Phone Number already exists "],
    },
    password:{
        type:String,
        required:[true,"Password is required "],
        minLength:[6,"Password must be of atleast 6 char long "]
    },
    avatar:{ 
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    address:{
        type:String,
    },
    pinCode:{
        type:Number
    },
    role:{
        type:String,
        default:"productmanager"
    },
    products:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Product"
        }
    ],
    sellers:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Seller"
        }
    ],
    users:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    refreshToken:{
        type:String
    },
    deleted:{
        type:Boolean,
        default:false
    },
    sessionToken:{
        type:Date
    },
    managerCookie:{
        type:String
    },
    resetPasswordExpire:String,
    resetPasswordToken:String

},{timestamps:true});


managerSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
});


managerSchema.methods.comparepassword = async function (password){
    return await bcrypt.compare(password,this.password);
}


managerSchema.methods.getjwtToken = function(){
    const date = Date.now();
    this.sessionToken = date;
    return jwt.sign(
    {
        _id:this._id,
        role:"manager",
        email:this.email,
        date:date
    },
    process.env.JWT_SECRET,
    { expiresIn:"15d"},
  );
}


managerSchema.methods.getResetToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");
 
    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
 }


export const Manager = mongoose.model("Manager",managerSchema);