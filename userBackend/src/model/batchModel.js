const mongoose = require("mongoose");

const batchschema = new mongoose.Schema({
    courseId: {
        type: String,
        required: [true, "Enter the course ID"]
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    time: {
        type: Number
    }

})

const Batch = mongoose.model("Batch", batchschema);

module.exports = Batch;