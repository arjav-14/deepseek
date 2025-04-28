import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const ChatSchema = new mongoose.Schema({
   
    name : {type : String, required : true},
    messages : [
        {
            role : {type : String, required : true},
            content : {type : String, required : true},
            timeStamp : {type : String, required : true},
        },
    ],
    userId : {type : String, required : true},
}
,
{timestamps:true})

const Chat =mongoose.models.Chat ||  mongoose.model("Chat" , ChatSchema);

export default Chat;
