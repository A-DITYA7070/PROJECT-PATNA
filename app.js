import express from "express";
import dotenv from "dotenv";
import connectToMongodb from "./database/connect-mongo.js";
import errorMiddleWare from "./middlewares/errors/error.middleware.js";
import cookieParser from "cookie-parser";
import pkg from 'body-parser';
import allRoutes from "./routes/index.js";



const app = express();


/**
 * Setting up dotenv 
 */
dotenv.config({path:"./.env"});

/**
 * Connecting to DATABASE..
 */
connectToMongodb();

/**
 * using global middlewares..
 */
app.use(express.json());
app.use(cookieParser());
app.use(
    express.urlencoded({
    extended: true, 
}));
// app.use(csrf({
//     cookie:true
// }));
const {json} = pkg;
app.use(json({ limit: '16mb' }));



/**
 * using custom middlewares.
 */
app.use("/api/v1",allRoutes);




export default app;

/**
 * Using Error Middleware..
 */
app.use(errorMiddleWare);
