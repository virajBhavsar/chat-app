const mongoose = require('mongoose');

const socketsSchema = new mongoose.Schema({
    socketId:{
        type:String,
        default : ''
    },
    userId : {
        type:String,
    },
    online:{
         type:Boolean,
         default:false,   
    },
    visitorsScoketIds:{
        type:[String],
    }
})

module.exports = mongoose.model('sockets', socketsSchema);