const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);
router.get("/profile", checkAuth, UserController.user_profile);
router.post("/appointment/create", checkAuth, UserController.user_createAppointment);
router.post(
  "/appointment/check",
  checkAuth,
  UserController.user_appointment
);
router.get("/test/get",checkAuth,UserController.user_getTest)
router.get("/prescription/get",checkAuth,UserController.user_getPrescription)
module.exports = router;

