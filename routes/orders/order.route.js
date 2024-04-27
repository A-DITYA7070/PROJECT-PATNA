import express from "express";


import { 
    cancelOrder,
    createOrder, 
    getAllOrders,
    getOrder
} from "../../controllers/orders/order.controller.js";
import { isAuthenticated } from "../../middlewares/auth/auth.middleware.js";

const router = express.Router();


router.route("/new/:id").post(isAuthenticated,createOrder);
router.route("/").get(isAuthenticated,getAllOrders);
router.route("/:id")
.get(isAuthenticated,getOrder)
.patch(isAuthenticated,cancelOrder);


export default router;