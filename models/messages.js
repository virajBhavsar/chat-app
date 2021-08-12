const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content:{
        type:String,
    },
    senderId:{
        type:String,
    },
    recieverId:{
        type:String,
    },
    status:{
        type:String,
        default:"time"
    },
    date:{
        type: Date,
        default:Date.now()
    }
})
const messagesSchema = new mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    messages:{
        type: [messageSchema]
    },
    contacts:{
        type:[String]
    }


})

module.exports = mongoose.model('messages', messagesSchema)