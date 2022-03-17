const express = require("express");
const Course = require("../model/courseModel");
const Teacher = require("../model/teacherModel");
const Payment = require("../model/paymentModel");
const jwt = require("jsonwebtoken");
const route = express.Router();


// add new course

route.post("/add-course", async (req, res) => {
  try {
    // console.log(`hh  ${req.body.heading.mainTitle}`);
    const teacherId = await Teacher.findOne({courseId: req.body.courseId}, (err, teacher) => {
      if(err){
        res.status(401).json({
          "message": "unable to search for the teacher!"
        })
      }
      if(!teacher){
        res.status(401).json({
          "message": "No teacher found for this course!. Get a teacher first."
        })
      }
    });
    const user = await Payment.find({})
    const course = await new Course({
    courseId:req.body.courseId,
    courseName: req.body.courseName,
    teacherId: teacherId._id,
    courseRating  : req.body.courseRating,
    imageLink :req.body.imageLink,
    videoLink :req.body.videoLink ,
    heading: req.body.heading
    });
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});


// GET Course By Id
route.get("/course/:id?", async (req, res) => {
    try {
      // console.log(`"1" ${req.params.id}`)
      if (req.params.id) {
        // console.log(`"1" ${req.query.id}`)
        const courseDetail = await Course.findById(req.params.id);
        res.status(200).send(courseDetail);
      } else{
        const courses = await Course.find({});
        res.status(200).send(courses);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = route;