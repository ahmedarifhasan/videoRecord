const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    created_at: Date,
    updated_at: {
        Date
    }
})


module.exports = mongoose.model('video', videoSchema)