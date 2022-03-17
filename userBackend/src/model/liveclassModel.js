const mongoose = require('mongoose');

const liveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Teacher'
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    imageUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    meetURL: {
        type: String,
    },
    date: {
        type: Date
    },
    time: {
        type: Number
    }
}, {
    timestamps: true
});

const Live = mongoose.model("Live",liveSchema);

module.exports = Live;