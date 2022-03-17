const express = require("express");
const Users = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../../../ecomBackend/src/auth/auth");
const route = express.Router();

// sign up 
route.post("/signup", async (req, res) => {
  try{
    const {name,mobile,email,password,confirm_password} = req.body
    if(password === confirm_password){
        const userExist = await Users.findOne({email:email});
        // console.log(userExist);
        if(!userExist){
            const hashedPassword = await bcrypt.hashSync(password,10);
            const userRegister = new Users({
                name:name,
                email:email,
                password:hashedPassword,
                mobile:mobile
            });
            const token = await userRegister.genAuthToken();
            res.cookie("jwt",token,{httpOnly:true, secure:true, maxAge:24 * 60 * 60 * 1000});
            const userRegistered = await userRegister.save();
            if(userRegistered ){
                res.status(201).json({
                    message:"User Created",
                    user:userRegistered,
                    token:token
                });
            } else {
                res.status(500).json({
                    message:"Internal Server Error"
                })
            }
        } else {
            res.status(208).json({
                message:"User Already Exist"
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
route.post("/login", async (req, res) => {
  try{
    const {email,password} = req.body;
    const checkUser = await Users.findOne({email:email}) || await Users.findOne({mobile: email});;
    if(checkUser){
        const checkPassword = bcrypt.compareSync(password,checkUser.password);
        if(checkPassword){
            const allTokens = checkUser.tokens;
            if(allTokens.length > 4)
            {
                checkUser.tokens = [];
                await checkUser.save();
            }
            const token = await checkUser.genAuthToken();
            res.cookie("jwt",token,{httpOnly:true, secure:true, maxAge:24 * 60 * 60 * 1000});
            res.status(200).json({
                message:"User Found",
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