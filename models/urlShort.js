const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UrlModel = mongoose.model("UrlModel", UrlSchema);

module.exports = UrlModel;
