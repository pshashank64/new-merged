//////////////////////////DEPENDENCIES//////////////////////
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cookies = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require("./database/connection");

///////////////////////PORT///////////////////
const PORT = process.env.PORT || 3000;
//////////////////////MONGOOSE CONNECTION///////////////////
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cookies());
app.use(cors());

// view engine only for testing the payment checkout
app.set("view engine","ejs");
app.set("views", "views");

// ecommerce 
const prodRoute = require("./ecomBackend/src/api/productRoute");
const addressRoute = require("./ecomBackend/src/api/addressRoute");
const paymentRoute = require("./ecomBackend/src/api/paymentRoute");
app.use(prodRoute);
app.use(addressRoute);
app.use(paymentRoute);

// login and signup as a student
const userValidateRoute = require("./userBackend/src/api/user");
app.use(userValidateRoute);

// login and signup as a tecaher
const teacherValidateRoute = require("./userBackend/src/api/teacher");
app.use(teacherValidateRoute);

// courses
const coursesRoute = require("./userBackend/src/api/courseApi");
app.use(coursesRoute);

// buy courses
const buyCourses = require("./userBackend/src/api/payments");
app.use(buyCourses);

// create and modify the batch for any courses
const batchTasks = require("./userBackend/src/api/batchApi");
app.use(batchTasks);

// operations for live classes:
const liveClass = require("./userBackend/src/api/liveclassApi");
app.use(liveClass);

// live class rating and reviews
const liveClassRating = require("./userBackend/src/api/liveclassReviewApi");
app.use(liveClassRating);

  // All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
//   });
app.get("/", (req, res) => {
       res.send(`<h1>Server is Started</h1>`);
     });



app.listen(PORT,function(){
    console.log(`Server Started at PORT ${PORT}`);
});
