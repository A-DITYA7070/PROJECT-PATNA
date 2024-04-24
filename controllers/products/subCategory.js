import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import { Category } from "../../models/products/category.model.js";
import { Subcategory } from "../../models/products/subCategory.model.js";
import ErrorHandler from "../../utils/errorHandler.js";


const createSubCategory = catchAsyncError(async(req,res,next) => {
    const {name,description} = req.body;
    if(!name || !description){
        return next(new ErrorHandler("Bad Request ",400));
    }
    const subcategory = await Subcategory.create({
        name,
        description
    });

    res.status(201).json({
        success:true,
        subcategory
    });
});

const getSubCategories = catchAsyncError(async(req,res,next)=>{
    const subcategory = await Subcategory.find({});
    res.status(200)
    .json({
        success:true,
        subcategory
    });
});


const getSubCategory = catchAsyncError(async(req,res,next)=> {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad Request ",400));
    }
    const subcategory = await Subcategory.findById(id);
    if(!subcategory){
        return next(new ErrorHandler("Not found ",404));
    }
    res.status(200).json({
        success:true,
        subcategory
    });
});

const updateSubCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const {name,description,category} = req.body;
    if(!name || !description){
       return next(new ErrorHandler("Please enter ateast one field to update ",400));
    }
    if(!category){
        return next(new ErrorHandler("Category is required ",400));
    }
    const subCategory = await Subcategory.findById(id);
    if(!subCategory){
        return next(new ErrorHandler("Not found ",404));
    }
    
    if(name) {
        subCategory.name = name;
    }
    if(description) {
        subCategory.description = description;
    }
    if(category) {
        const existingCategory = await Category.findById(category);
        if(!existingCategory) {
            return next(new ErrorHandler("Category not found ",404));
        }
        subCategory.category = category;
    }

    await subCategory.save();

    res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        subCategory
    });
});

const deleteSubCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const subcategory = await Subcategory.findById(id);
    if(!subcategory){
        return next(new ErrorHandler("Not found ",404));
    }
    subcategory.deleteOne();
    res.status(200).json({
        success:true,
        message:"Deleted successfully "
    })
})

export {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}