const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 6,
    },
    email: {
        type: String,
        require: true,
        min: 100,
    },
    password: {
        type: String,
        require: true,
        max: 16,
        min: 8,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', userSchema)