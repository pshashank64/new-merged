const express = require("express");
const router = express.Router();
const Live = require("../model/liveclassModel");
const authTeacher = require("../../../ecomBackend/src/auth/authTeacher");

// Creation of LIVE CLASS
router.post("/create-liveclass/:id",authTeacher ,async(req,res) =>{
    try {
        const courseId = req.params.id;
        const teacherId = req.teacher._id;
        const {title,description,imgUrl, vidUrl,meetUrl,date, time} = req.body;
        const classes = new Live({
            title:title,
            teacherId: teacherId,
            courseId: courseId,
            description:description,
            imageUrl: imgUrl,
            videoUrl: vidUrl,
            meetUrl: meetUrl,
            date: date,
            time: time
        })
        classes.save().then((classes) => {
            res.status(200).json({
                "message": "liveclass data stored in the db",
                "data": classes
            })
        }).catch((err) => {
            if(err) {
                res.status(400).json({
                    "message": "Unable to create a liveclass"
                })
            }
        })
    }catch(error) {
        if(error){
            res.status(400).json({
                "message": "Internal server error!"
            })
        }
    }
    
})


// to fetch live class
router.get("/livedetails/:id", (req, res) => {
    try {
        Live.findOne({_id: req.params.id}, (err, classdetails) => {
            if(err){
                res.status(401).json({
                    "message": "error in searching for the class details!"
                });
            }
            if(!classdetails){
                res.status(404).json({
                    "message": "live class details not found for this id"
                });
            }
            if(classdetails){
                res.status(200).json({
                    "message": "class found!",
                    "class details": classdetails
                });
            }
        })
    }catch(error){
       if(error){
           res.status(401).json({
               "message": "internal server error!"
           })
       } 
    }
});

router.post("/updateClass/:id",authTeacher , (req, res) => {
    try {
        Live.findOneAndUpdate({_id: req.params.id}, {
            meetURL: req.body.meetUrl,
            date: req.body.date,
            time: req.body.time
        }).then(() => {
            Live.findOne({_id: req.params.id}).then((item) => {
                res.send({
                    "data": item,
                    "status": 200,
                    "message": "liveclass updated!"
                });
                // console.log(item);
            });
        }).catch(err => {
            res.status(400).send("unable to update the class");
        });
    }catch(error){
        if(err){
            console.log(err);
            res.status(400).json({
                "message": "internal server error!"
            })
        }
    }
})

module.exports = router;