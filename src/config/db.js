import mongoose from "mongoose";
let catched = global.mongoose || {conn : null , promise : null};
export default async function connectDB(){
    if(catched.conn) return catched.conn;
    if(!catched.promise){
        catched.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose)=>mongoose)
    }
    try{
            catched.conn = await catched.promise;
    }
    catch(error){
        console.log("MongoDB connection error", error);
    }
    return catched.conn;
}