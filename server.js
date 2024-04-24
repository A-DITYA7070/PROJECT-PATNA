import app from "./app.js";
import cloudinary from "cloudinary";
import nodecron from "node-cron";

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_APIKEY,
    api_secret:process.env.CLOUDINARY_CLIENT_APISECRET
});

nodecron.schedule("0 0 0 1 * *",async()=>{
    try{
      await Stats.create({});
    }catch(error){
      console.log(err);
    }
 })

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on port ${process.env.PORT}`);
})