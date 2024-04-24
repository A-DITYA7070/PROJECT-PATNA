import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import { Seller } from "../../models/accounts/seller.model.js";
import { Product } from "../../models/products/product.model.js";
import ErrorHandler from "../../utils/errorHandler.js";

const createProduct = catchAsyncError(async(req,res,next) => {
    const {
        name,
        category,
        subCategory,
        price,
        mrp,
        description,
        createdBy,
        stock,
        quantity,
        unit
    } = req.body;

    const image = {
        public_id:"demo_id",
        url:"demo_url"
    }
    const addImage = [];
    addImage.push(image);

    const seller = req.user.id;
    let product = await Product.create({
        name,
        category,
        subCategory,
        price,
        mrp,
        description,
        createdBy,
        stock,
        quantity,
        unit,
        images:addImage,
        seller:seller    
    });
    res.status(201).json({
        success:true,
        product
    })
});


/**
 * Product controller function to get approved products its written with aggregation pipelines 
 */
const getApprovedProducts = catchAsyncError(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const pipeline = [
        {
            $match: {
                isApproved: true
            }
        },
        {
            $lookup: {
                from: "categories", // Name of the Category collection
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category" // Deconstruct the category array
        },
        {
            $lookup: {
                from: "sellers", // Name of the Seller collection
                localField: "seller",
                foreignField: "_id",
                as: "seller"
            },
        },
        {
            $unwind: "$seller" // Deconstruct the seller array
        },
        {
            $match: {
                "seller.isApproved": true 
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField:"subCategory",
                foreignField:"_id",
                as: "subCategory"
            }

        },
        {
            $unwind:"$subCategory",
        },
        {
            $project: {
                "createdAt": 0,
                "updatedAt": 0,
                "__v": 0,
                "category.createdAt": 0, // Exclude createdAt from category
                "category.updatedAt": 0, // Exclude updatedAt from category
                "category.__v": 0, // Exclude __v from category
                "seller.createdAt": 0, // Exclude createdAt from seller
                "seller.updatedAt": 0, // Exclude updatedAt from seller
                "seller.__v": 0, // Exclude __v from seller
                "seller.sellerCookie":0,
                "seller.sessionToken":0,
                "seller.password":0,
                "seller.role":0,
                "seller.phoneNumber":0,
                "seller.email":0,
                "seller.deleted":0,
                "seller.isApproved":0,
                "isApproved":0,
                "subCategory.createdAt":0,
                "subCategory.updatedAt":0,
                "subCategory.__v":0
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];

    const products = await Product.aggregate(pipeline);

    res.status(200).json({
        success: true,
        products
    });
});


/**
 * Delete product 
 */
const deleteProduct = catchAsyncError(async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product not found ",404));
    }
    await product.deleteOne();
    res.status(200)
    .json({
        success:true,
        message:"Product deleted successfully "
    });
});


export {
    createProduct,
    getApprovedProducts,
    deleteProduct
}