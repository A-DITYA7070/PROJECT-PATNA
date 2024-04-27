import { User } from "../../models/accounts/user.model.js";
import cloudinary from "cloudinary";
import getDataUri from "../../utils/dataUri.js";
import { sendToken } from "../../utils/sendToken.js";
import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { Product } from "../../models/products/product.model.js";
import { Address } from "../../models/orders/address.model.js";
import mongoose from "mongoose";


const register = catchAsyncError(async(req,res,next)=>{
    const {name,email,password,phoneNumber} = req.body;

    if(!name || !email || !password || !phoneNumber) return next(new ErrorHandler("Please Enter all fields..",400));
    
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("user already exists ",409));
    }

    // upload file on cloudinary..
    
    // const file=req.file;
    // const fileUri=getDataUri(file);
    // const mycloud=await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        avatar:{
            // public_id:mycloud.public_id,
            // url:mycloud.secure_url,
            public_id:"demo_id",
            url:"demo_url"
        }

    });
    sendToken(res,user,"Registered succesfully ",201);
   
 });

 const login = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password) return next(new ErrorHandler("Please Enter all fields..",400));
    
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found ",404));
    }
    
    const isMAtch = await user.comparepassword(password);

    if(!isMAtch){
        return next(new ErrorHandler("Incorrect Email or password",401));
    }
    sendToken(res,user,`Welcome back !! ${user.name}`,200);
   
 });

 const logout = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:false,
        secure:true,
        sameSite:"lax",
    }).json({
        success:true,
        message:"logged out successfully"
    })
 });

 /**
  * User controller function to get profile.
  */
 const myProfile = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    res.status(200)
    .json({
        success:true,
        user
    })
 });

 /**
  * Add product to cart..
  */
 const addToCart = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Bad request", 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;

    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        return next(new ErrorHandler("Invalid quantity", 400));
    }

    let productIndex = user.cart.findIndex(item => String(item.productId) === id);

    if (productIndex !== -1) {
        user.cart[productIndex].quantity += quantity;
    } else {
        user.cart.push({ productId: product._id, quantity: quantity });
    }
    await user.save();

    res.status(200)
       .json({
            success: true,
            message: "Product added to cart",
        });
});


/**
 * Controller function to view cart of user 
 */
const viewCart = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('cart.productId');
    
    if(!user){
        return next(new ErrorHandler("Unauthorised",401))
    }

    const aggregatedCart = user.cart.map(cartItem => {
        const quantity = cartItem.quantity;
        const product = cartItem.productId;
        const productPrice = product.price; 
        const itemTotalPrice = productPrice * quantity;

        return {
            quantity: quantity,
            product: product,
            itemTotalPrice: itemTotalPrice
        };
    });

    res.status(200).json({
        success: true,
        cart: aggregatedCart,
    });
});

/**
 * Controller function to remove items from cart.
 */
const removeFromCart = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const productId = req.params.id;
    const cartItem = user.cart.find(item => item.productId && item.productId.equals(productId));

    if (!cartItem) {
        return next(new ErrorHandler("Item not found in cart", 404));
    }

    let quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;

    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        return next(new ErrorHandler("Invalid quantity", 400));
    }

    if (cartItem.quantity > quantity) {
        cartItem.quantity -= quantity;
    } else {
        const cartItemIndex = user.cart.findIndex(item => item.productId && item.productId.equals(productId));
        user.cart.splice(cartItemIndex, 1);
    }
    
    await user.save();

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully"
    });
});

/**
 * Controller function to add address
 */
const addAddress = catchAsyncError(async(req,res,next) => {
    const {
        street,
        district,
        phoneNumber,
        city,
        postalCode,
        state,
        country,
        manualAddress,
        landMark
    } = req.body;

    if(!street || !district || !postalCode || !state || !phoneNumber){
        return next(new ErrorHandler("Please enter required field ",400));
    }
    const user = req.user?.id;
    let address = await Address.create({
        street,
        district,
        phoneNumber,
        city,
        postalCode,
        state,
        country,
        manualAddress,
        landMark,
        user:user
    });
    res.status(201).json({
        success:true,
        message:"Address added sucessfully"
    });
});

/**
 * Controller function to get all address
 */
const getAllAddress = catchAsyncError(async(req,res,next) => {
    const user = req.user.id;
    if(!user){
        return next(new ErrorHandler("UNAUTHORISED",401));
    }

    const address = await Address.find({user:user});
    res.status(200).json({
        success:true,
        address
    })
});

/**
 * controller function to get single address of logged in user.
 */
const getAddress = catchAsyncError(async(req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
    }
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Bad request", 400));
    }
    const address = await Address.findById(id);
    if (!address) {
        return next(new ErrorHandler("Address not found", 404));
    }
    const userIdObject = new mongoose.Types.ObjectId(userId);
    if (!address.user.equals(userIdObject)) {
        return next(new ErrorHandler("Unauthorized", 401));
    }
    res.status(200).json({
        success: true,
        address
    });
});

/**
 * Controller function to make address default.
 */
const makeDefaultAddress = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Bad request", 400));
    }

    let addresses = await Address.find({ user: userId });

    let addressUpdated = false;

    for (let address of addresses) {
        if (address.id === id) {
            address.isDefault = true;
            addressUpdated = true;
        } else {
            address.isDefault = false;
        }
        await address.save();
    }

    if (!addressUpdated) {
        return next(new ErrorHandler("Address not found", 404));
    }

    res.status(200).json({
        success:true,
        message:"Address set to default"
    })
});

/**
 * Controller function to updateAddress
 */
const updateAddress = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const {
        street,
        district,
        phoneNumber,
        city,
        postalCode,
        state,
        manualAddress,
    } = req.body;
    if(!street && !district && !phoneNumber && !city && !postalCode && !state && !manualAddress){
        return next(new ErrorHandler("Please enter atleast one field to update "));
    }
    let address = await Address.findByIdAndUpdate(id,req.body,{new:true});
    if(!address){
        return next(new ErrorHandler("Not found",404));
    }
    res.status(200)
    .json({
        success:true,
        message:"Updated"
    });
});

/**
 * Controller function to delete address
 */
const deleteAddress = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const userId = req.user.id;
    if(!userId){
        return next(new ErrorHandler("Unauthorised ",401));
    }
    let address = await Address.findById(id);
    if(!address){
        return next(new ErrorHandler("Not found ",404));
    }
    const userIdObject = new mongoose.Types.ObjectId(userId);
    if(!address.user.equals(userIdObject)){
        return next(new ErrorHandler("Unauthorised ",401));
    }
    await address.deleteOne();
    res.status(200).json({
        success:true,
        message:"Deleted"
    })
})



 export {
    register,
    login,
    logout,
    myProfile,
    addToCart,
    viewCart,
    removeFromCart,
    addAddress,
    getAllAddress,
    getAddress,
    makeDefaultAddress,
    updateAddress,
    deleteAddress
 }