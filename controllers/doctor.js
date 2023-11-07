const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Doctor = require("../models/Doctor");
const Test = require("../models/Test");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

exports.doctor_signup = (req, res) => {
  Doctor.find({ email: req.body.email })
    .exec()
    .then((doctor) => {
      if (doctor.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const doctor = new Doctor({
              name: req.body.name,
              mobile: req.body.mobile,
              email: req.body.email,
              password: hash,
              speciality: req.body.speciality,
            })
            doctor
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "doctor created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.doctor_login = (req, res) => {
  Doctor.find({ email: req.body.email })
    .exec()
    .then((doctor) => {
      if (doctor.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, doctor[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: doctor[0].email,
              doctorId: doctor[0]._id,
            },
            "doctor"
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            doctorData: doctor,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.doctor_createLab =async (req,res)=>{
  const id = req.doctorData.doctorId;
  try{
    const test = new Test({
      doctor : id,
      patient : req.body.patient,
      tests : req.body.tests
    })
    await test.save().then((data)=>{
      res.status(200).json({
        MSG : "successfull"
      })
    })
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      error: err,
      MSG : "unsuccessfull"
    })
  }
}

exports.doctor_appointment = async (req,res) =>{
  const id = req.doctorData.doctorId;
  const date = req.body.date;
  try{
    await Appointment.find({ doctor: id ,date:date}).then(async (data) => {
      // const populatedData = await Doctor.populate(data, { path: "doctor" });
      res.status(200).json({
        data: data,
        MSG: "successfull",
      });
    });
  }
  catch(err){
    res.status(500).json({
      error: err,
      MSG: "unsuccessfull",
    });
  }
}

exports.doctor_getLab = async (req, res) => {
  const id = req.doctorData.doctorId;
  try {
    
    await test.find({doctor:id}).then((data) => {
      res.status(200).json({
        data:data,
        MSG: "successfull",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      MSG: "unsuccessfull",
    });
  }
};
exports.doctor_createPres = async (req, res) => {
  const id = req.doctorData.doctorId;
  try {
    const prescription = new Prescription({
      doctor: id,
      user: req.body.user,
      patient: req.body.patient,
      symptoms: req.body.symptoms,
      description: req.body.description, 
      diagnosis: req.body.diagnosis,
      medicines: req.body.medicines,
      remarks: req.body.remarks,
    });
    await prescription.save().then((data) => {
      res.status(200).json({
        MSG: "successfull",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      MSG: "unsuccessfull",
    });
  }
};


