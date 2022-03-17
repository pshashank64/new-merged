const express = require("express");
const Teachers = require("../model/teacherModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authTeacher = require("../../../ecomBackend/src/auth/authTeacher");
const route = express.Router();

// sign up 
route.post("/signup-teacher", async (req, res) => {
  try{
    const {name,mobile,email,password,confirm_password,courseId, qualification, rating} = req.body
    if(password === confirm_password){
        const teacherExist = await Teachers.findOne({email:email});
        // console.log(userExist);
        if(!teacherExist){
            const hashedPassword = await bcrypt.hashSync(password,10);
            const teacherRegister = new Teachers({
                name:name,
                email:email,
                password:hashedPassword,
                mobile:mobile,
                courseId: courseId,
                qualification: qualification,
                rating: rating
            });
            const token = await teacherRegister.genAuthToken();
            res.cookie("jwt",token,{httpOnly:true, secure:true, maxAge:24 * 60 * 60 * 1000});
            const teacherRegistered = await teacherRegister.save();
            if(teacherRegistered ){
                res.status(201).json({
                    message:"User Created as a teacher",
                    teacher:teacherRegistered,
                    token:token
                });
            } else {
                res.status(500).json({
                    message:"Internal Server Error"
                })
            }
        } else {
            res.status(208).json({
                message:"Teacher Already Exist"
            })
        }
    } else {
        res.status(403).json({
            message:"Password Don't Match"
        })
    }
} catch(err) {
    console.log(err);
    res.status(500).json({
        message: err.message
    })
}
});

// login
route.post("/login-teacher", async (req, res) => {
  try{
    const {email,password} = req.body;
    const checkTeacher = await Teachers.findOne({email:email}) || await Teachers.findOne({mobile: email});;
    if(checkTeacher){
        const checkPassword = bcrypt.compareSync(password,checkTeacher.password);
        if(checkPassword){
            const allTokens = checkTeacher.tokens;
            if(allTokens.length > 4)
            {
                checkTeacher.tokens = [];
                await checkTeacher.save();
            }
            const token = await checkTeacher.genAuthToken();
            res.cookie("jwt",token,{httpOnly:true, secure:true, maxAge:24 * 60 * 60 * 1000});
            res.status(200).json({
                message:"Teacher Found",
                token:token
            });
        } else {
            res.status(401).json({
                message:"Wrong Email or Password"
            });
        }
    } else {
        res.status(401).json({
            message:"Wrong Email or Password"
        });
    }
} catch(err) {
    console.log(err);
    res.status(500).json({
        message:"Internal Server Error"
    });
}
});


// logout


route.post("/logout", (req, res) => {
    res.cookie("jwt","",{httpOnly:true, maxAge:1});
    res.status(200).json({
        message:"Log Out Successfully"
    });
  });


module.exports = route;