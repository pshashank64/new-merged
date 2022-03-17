const mongoose = require("mongoose");
require('dotenv').config();
const DB = process.env.DB;
mongoose.connect(DB ,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`connection successfull`);
}).catch((e) => {
    console.log(`connection unsuccessfull`);
})