const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Appointment = require("../models/Appointment")
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Test = require("../models/Test");
const Prescription = require("../models/Prescription");

exports.user_signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
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
            const user = new User({
              name: req.body.name,
              mobile: req.body.mobile,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
               
                res.status(201).json({
                  message: "User created",
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

exports.user_login = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "password",
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            userData : user,
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

exports.user_appointment = async (req,res) =>{
  try {
    const date= new Date(req.body.date)
    const doctors = await Doctor.find();
    const shifts = await Promise.all(
      doctors.map(async (doctor) => {
        const arrs = ["morning", "afternoon", "evening"];
        const slots = {};

        await Promise.all(
          arrs.map(async (arr) => {
            const data = await Appointment.aggregate([
              { $match: { date: date, doctor: doctor._id, shift: arr } },
              { $group: { _id: "$doctor", count: { $sum: 1 } } },
            ]);

            if (data.length > 0) {
              slots[arr] = 20 - data[0].count;
            } else {
              slots[arr] = 20; 
            }
          })
        );
        
        return {
          doctor: doctor._id,
          slots: slots,
        };
      })
    );
     const populatedShifts = await Doctor.populate(shifts, { path: "doctor" });
    console.log(shifts);
    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.user_createAppointment = async (req,res)=>{
  
  try{
    const id = req.userData.userId;
    const appointment = new Appointment({
      doctor: req.body.doctor,
      user: id,
      shift: req.body.shift,
      date: req.body.date,
      patient: {
        name: req.body.patient.name,
        age: req.body.patient.age,
        gender: req.body.patient.gender,
      },
      symptoms : req.body.symptoms
    });
            appointment
              .save()
              .then(() => {
               
                res.status(201).json({
                  message: "appointment created",
                });
              })
  }
  catch(err){
    res.status(500).json({
      error: err,
    });
  }
}
exports.user_profile = async (req,res)=>{
  const id = req.userData.userId;
  const user = await User.findOne({_id:id})
  if(user){
    res.status(200).json({
      name:user.fullName,
      Id:user._id,
      email:user.email,
      mobile:user.mobile
    })
  }
  else{
    res.status(500).json({
      message:"user not found"
    })
  }

}

exports.user_getTest = async (req,res)=>{
  const id = req.userData.userId;
  try{
      Test.find({patient:id}).then((data)=>{
        res.status(200).json({
          data:data,
          message:"Successfull",
        })
      })
  }
  catch(err){
    res.status(500).json({
      message:"Server error",
      error: err,
    })
  }
}

exports.user_getPrescription = async (req, res) => {
  const id = req.userData.userId;
  try {
    Prescription.find({ user: id }).then(async(data) => {
      const populatedData = await Doctor.populate(data, { path: "doctor" });
      res.status(200).json({
        data: populatedData,
        message: "Successfull",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err,
    });
  }
};