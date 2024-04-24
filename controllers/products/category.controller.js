import { Category } from "../../models/products/category.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";


const createCategory = catchAsyncError(async(req,res,next) => {
    const {
        name,
        description
    } = req.body;

    if(!name || !description){
        return next(new ErrorHandler("Enter all fields ",400));
    }

    const user = req.user;

    if(user.role !== "admin"){
        return next(new ErrorHandler("UnAuthorised ",401));
    }

    const category = await Category.create({
        name,
        description
    });

    res.status(201).json({
        success:true,
        category
    })
});


const getAllCategories = catchAsyncError(async(req,res,next) => {
    const category = await Category.find({});
    res.status(200).json({
        success:true,
        category
    });
});


const getCategory = catchAsyncError(async(req,res,next)=> {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const category = await Category.findById(id);
    if(!category){
        return next(new ErrorHandler("Not found",404));
    }
    res.status(200).json({
        success:true,
        category
    });
});


const updateCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    const {
        name,
        description
    } = req.body;
    
    if(!name && !description){
        return next(new ErrorHandler("Please enter atleast one field to update ",400));
    }

    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const category = await Category.findById(id);
    if(!category){
        return next(new ErrorHandler("Not found",404));
    }

    if(name){
        category.name=name;
    }
    if(description){
        category.description=description;
    }

    await category.save();
    
    res.status(200).json({
        success:true,
        message:"Updated successfully"
    });

});


const deleteCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const category = await Category.findById(id);
    if(!category){
        return next(new ErrorHandler("Not Found ",404));
    }
    category.deleteOne();
    await category.save();
    res.status(200).json({
        success:true,
        message:"Deleted successfully "
    })
})


export {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
}