const jwt = require("jsonwebtoken");
const Teacher = require("../../../userBackend/src/model/teacherModel");
const authTeacher = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verifiedToken._id);
    const teacher = await Teacher.findOne({
      _id: verifiedToken._id,
      "tokens.token": token,
    });
    if (!teacher) {
      throw new Error();
    }
    req.token = token;
    req.teacher = teacher;
    next();
  } catch (e) {
    res.status(401).send({ error: "please Authorize" });
  }
};

module.exports = authTeacher;
