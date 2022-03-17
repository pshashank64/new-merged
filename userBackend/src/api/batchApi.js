const express = require("express");
const router = express.Router();
const Batch = require("../model/batchModel");
const Course = require("../model/courseModel");
const authTeacher = require("../../../ecomBackend/src/auth/authTeacher");

router.post("/createBatch", authTeacher, (req, res) => {

    var {courseId, name, date, time} = req.body;
    Course.findOne({courseId: courseId}, (err, batch) => {
        if(err){
            res.status(400).json({
                "message": "Unable to search for the course"
            })
        }
        if(!batch){
            res.status(404).json({
                "message": "Course Not found!"
            })
        }
        if(batch){
            const teacherId = req.teacher._id;
            var mydata = new Batch({courseId, teacherId, name, date, time});
            mydata.save()
                .then(item => {
                    res.send({
                        "data": item,
                        "status": 200,
                        "message": "Batch created"
                    });
                    console.log(item)
                })
                .catch(err => {
                    res.status(400).send(err);
                }); 
        }   
    });

    
});

router.post("/editBatch", authTeacher, (req, res) => {
    Batch.findOne({name: req.body.name}, (err, batch) => {
        if(err){
            res.status(400).json({
                "message": "Unable to search for the batch!"
            })
        }
        if(!batch){
            res.status(404).json({
                "message": "Batch not found!"
            })
        }
        if(batch){ 
            Batch.findOneAndUpdate({name: req.body.name}, {
                date: req.body.date,
                time: req.body.time
            }).then(() => {
                Batch.findOne({name: req.body.name}).then((item) => {
                    res.send({
                        "data": item,
                        "satatus": 200,
                        "message": "timetable rescheduled!"
                    });
                    // console.log(item);
                });
            }).catch(err => {
                res.status(400).send("unable to reschedule the batch!");
            });
        }
    })
    
})

module.exports = router;