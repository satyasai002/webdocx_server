const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const password = "doctor";
    const decoded = jwt.verify(token, password);
    req.doctorData = decoded;
    console.log(req.doctorData.email);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      error: error,
    });
  }
};
