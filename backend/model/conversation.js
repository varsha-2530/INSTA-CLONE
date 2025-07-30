import mongoose from "mongoose";
import message from "./message.js";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'

    }],

});
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;