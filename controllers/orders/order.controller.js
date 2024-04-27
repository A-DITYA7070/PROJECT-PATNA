import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import { User } from "../../models/accounts/user.model.js";
import { Address } from "../../models/orders/address.model.js";
import { Order } from "../../models/orders/order.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";


const createOrder = catchAsyncError(async(req,res,next)=>{
    const { id: addressId } = req.params;
    if (!addressId) {
        throw new ErrorHandler("Please select an address to order", 400);
    }

    const userId = req.user.id;
    if (!userId) {
        throw new ErrorHandler("Unauthorized", 401);
    }

    const user = await User.findById(userId)
        .populate('address')
        .populate({
            path: 'cart.productId',
            model: 'Product'
        });
    if (!user) {
        throw new ErrorHandler("User not found", 404);
    }

    const address = await Address.findById(addressId);
    if (!address) {
        throw new ErrorHandler("Address not found", 404);
    }

    let totalPrice = 0;
    const items = user.cart.map(cartItem => {
        const { productId, quantity } = cartItem;
        const productPrice = productId.price;
        const itemTotalPrice = productPrice * quantity;
        totalPrice += itemTotalPrice;
        return {
            product: productId,
            quantity: quantity,
            itemTotalPrice: itemTotalPrice
        };
    });

    const order = new Order({
        orderNumber: generateOrderNumber(),
        orderedBy: userId,
        items: items,
        totalAmount: totalPrice,
        address: address
    });

    await order.save();

    // Clear user's cart after order creation
    user.cart = [];
    await user.save();

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: order
    });
});


const getAllOrders = catchAsyncError(async(req,res,next) => {
    const id = req.user.id;
    const orders = await Order.find({orderedBy:id});
    res.status(200)
    .json({
        success:true,
        orders
    });
});

/**
 * Controller function to get single order by id
 */
const getOrder = catchAsyncError(async(req,res,next) => {
    const id = req.user.id;
    const orderId = req.params.id;
    if(!orderId){
        return next(new ErrorHandler("Bad request ",400));
    }
    const order = await Order.findById(orderId);
    const userId = new mongoose.Types.ObjectId(id);
    if(!order.orderedBy.equals(userId)){
        return next(new ErrorHandler("Unauthorised",401));
    }
    if(!order){
        return next(new ErrorHandler("Not found ",404));
    }
    res.status(200)
    .json({
        success:true,
        order
    });
});

/**
 * Controller function to cancel order
 */
const cancelOrder = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const user = req.user.id;
    const userId = new mongoose.Types.ObjectId(user);
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Not found",404));
    }
    if(!order.orderedBy.equals(userId)){
        return next(new ErrorHandler("Unauthorised",401));
    }
    order.status = "CANCELLED";
    await order.save();
    res.status(200)
    .json({
        success:true,
        message:"Order cancelled "
    });
});

/**
 * 
 */

export {
    createOrder,
    getAllOrders,
    getOrder,
    cancelOrder
}