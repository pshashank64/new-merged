const express = require("express");
const router = express.Router();
const Review = require("../model/liveclassReview");
const Live = require("../model/liveclassModel");
const auth = require("../../../ecomBackend/src/auth/auth");


router.post("/createReview/:id", auth, (req,res) =>{
    // const {teacherName, rating} = req.body;
    const classId = req.params.id;
    const studentId = req.user._id;
    const {rating, review} = req.body;
    try {
        Live.findOne({_id: classId}, (err, clas) => {
            if(err){
                res.status(400).json({
                    "message": "unable to search for the live class"
                })
            }
            if(!clas){
                res.status(404).json({
                    "message": "unable to find the class!"
                })
            }
            if(clas){
                const newReview = new Review({
                    classId: classId,
                    studentId: studentId,
                    rating: rating,
                    review: review
                });
                newReview.save().then((item) => {
                    res.status(200).json({
                        "details": item
                    })
                })
            }
        });
    } catch (error) {
        if(error){
            res.status(401).json({
                "message": "Internal server error!"
            })
        }
    }
 
})


module.exports = router;