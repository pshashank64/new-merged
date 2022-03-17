const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter the Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter the Email"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Please Enter the  Password"],
  },
  mobile:{
                type : Number,
                unique :true
                // required: [true,"Please Enter the Mobile Number"],
            },
  date_time: {type: Number, integer: true ,default: Date.now()},
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
      timestamp: {type: Number, required: true, integer: true, default: Date.now()},
    },
  ],
  courseId: {
    type: mongoose.Schema.Types.ObjectId
  }
});
userSchema.methods.genAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.password;

  return userObject;
};
const User = mongoose.model("User",userSchema);
module.exports = User;