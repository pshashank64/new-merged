const mongoose = require('mongoose');
// const Schema = new mongoose.Schema

const reviewSchema = new mongoose.Schema({
    classId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Live"
    },
    studentId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    rating: {
        type: Number
    },
    review: {
        type: String,
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;