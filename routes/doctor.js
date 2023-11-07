const express = require("express");
const router = express.Router();

const DoctorController = require("../controllers/doctor");
const checkAuth = require("../middleware/check-auth");
const doctorAuth = require("../middleware/doctor-auth");

router.post("/signup", DoctorController.doctor_signup);

router.post("/login", DoctorController.doctor_login);
router.post("/test",doctorAuth,DoctorController.doctor_createLab)
router.post("/appointment/get",doctorAuth,DoctorController.doctor_appointment)
router.post("/prescription/create",doctorAuth,DoctorController.doctor_createPres)
router.post("/labs/create",doctorAuth,DoctorController.doctor_createLab)

module.exports = router;
