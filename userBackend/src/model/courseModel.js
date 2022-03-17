const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const sectionSchema = new Schema({
    mainTitle:{type: String },
    h3: [String],
    h2:[
        {
        title: {type: String },
        topics:[String],
        paragraph:[String]
        }
       ]
   });

const courseSchema = new Schema({
    courseId:{
        type : String,
        unique :true,
        required: [true,"Please Enter the Course Id"],
        lowercase: true
    },
    courseName: {
        type: String,
        required: [true, "Please Enter the course Name"],
    },
    teacherId : {
        type: mongoose.Schema.Types.ObjectId
    },
    courseRating  : {  type : Number},
    imageLink :[String],
    videoLink :[String],
     heading:[sectionSchema],
  enrolledUsers: [
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
      timestamp: {type: Number, required: true, integer: true, default: Date.now()},
    },
  ],
  date_time: {type: Number, integer: true ,default: Date.now()}
});

const Course = mongoose.model("Course",courseSchema);
module.exports = Course;