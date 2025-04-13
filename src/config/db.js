// import mongoose from "mongoose";
// let catched = global.mongoose || {conn : null , promise : null};
// export default async function connectDB(){
//     if(catched.conn) return catched.conn;
//     if(!catched.promise){
//         catched.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose)=>mongoose)
//     }
//     try{
//             catched.conn = await catched.promise;
//     }
//     catch(error){
//         console.log("MongoDB connection error", error);
//     }
//     return catched.conn;
// }
import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
    try {
        if (cached.conn) {
            console.log('✅ Using existing MongoDB connection');
            return cached.conn;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error('❌ Missing MONGODB_URI in .env file');
        }

        if (!cached.promise) {
            const opts = {
                bufferCommands: true,
            };

            console.log('🔄 Connecting to MongoDB...');
            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
        }

        cached.conn = await cached.promise;
        console.log(`✅ MongoDB Connected Successfully to: ${mongoose.connection.host}`);
        
        // Add event listeners for connection status
        mongoose.connection.on('connected', () => {
            console.log('🟢 MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('🔴 MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🟡 MongoDB disconnected');
        });

        return cached.conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
}