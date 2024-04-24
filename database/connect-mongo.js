import mongoose from "mongoose";

const connectToMongodb = () => {
    mongoose.connect(process.env.MONGODB_URI,{})
    .then((conn)=>{
        console.log(`NO-SQL DB MONGO-DB is running on ${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Error occurred in NO-SQL Mongo DB ${err}`);
    });
}

export default connectToMongodb;