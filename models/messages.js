const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
    },
    type:{
        type:String,
        default:"msg"
    },
    content:{
        type:String,
    },
    status:{
        type:String,
        default:"time"
    },
    date:{
        type: Date,
        default:Date.now
    }
})


const messagesSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now
    },
    type : {
        type:String,
        default : "individual"
    },
    members:{
        type:[String],
        require:true
    },
    messages:{
        type: [messageSchema]
    }
})

module.exports = mongoose.model('messages', messagesSchema)