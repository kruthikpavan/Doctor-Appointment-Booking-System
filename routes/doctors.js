const express = require("express");
const xss = require('xss')
const data = require('../data');
const validator=require("../validation") 
const router = express.Router();
const userData = data.doctors;
const authMiddleware = (req,res,next)=>{
    if(req.session.doctors){
        next()
    }
    else{
        return res.redirect('/doctors')
    }
}
router
.route('/')
.get(async (req, res) => {
    if(req.session.doctors) return res.redirect('/doctors/home')
  return res.render('login',{doctor:true,path:'/doctors'})

  })
  .post(async(req,res)=> {
    req.session.doctors= 'doctorLoggedIn'
  return res.redirect('/doctors/home')
   
  })

  router.get("/signup", async (req, res) => {
    res.render("signupdoctor", { title: "Sign Up" });
  });
  
  router.post("/signup", async (req, res) => {
    let errors = [];
    let dateOfBirthConvert = xss(req.body.dateOfBirth.trim());
    let parts = dateOfBirthConvert.split("-");
    dateOfBirthConvert = `${parts[1]}/${parts[2]}/${parts[0]}`;
    let newUser = {
      name: xss(req.body.name.trim()),
      password: xss(req.body.password.trim()),
      email: xss(req.body.email.toLowerCase().trim()),
      phoneNumber: xss(req.body.phoneNumber.trim()),
      dateOfBirth: dateOfBirthConvert,
      category: xss(req.body.category.trim()),
      qualification: xss(req.body.qualification.trim()),
    };
    console.log("NEW USER: ");
    console.log(newUser);
  
    if (!validator.validString(newUser.name))
      errors.push("Invalid name.");
  
    if (!validator.validPassword(newUser.password))
      errors.push("Invalid password.");
    if (!validator.validEmail(newUser.email)) errors.push("Invalid email.");
    if (!validator.validDate(newUser.dateOfBirth))
      errors.push("Invalid Date of Birth.");
  
      if (!validator.validString(newUser.category)) errors.push("Invalid category.");
      if (!validator.validString(newUser.qualification)) errors.push("Invalid qualification.");
    if (errors.length > 0) {
      console.log(errors);
      return res.status(401).render("signupdoctor", {
        title: "Sign Up",
        userInfo: newUser,
        errors: errors,
      });
    }
  
    try {
      const addedUser = await userData.createDoctor(
        newUser.name,
        newUser.category,
        newUser.qualification,
        "",//hospital
        newUser.dateOfBirth,
        "",//gender
        newUser.email,
        newUser.phoneNumber,
        newUser.password
      );
      res.redirect("login");
    } catch (e) {
      errors.push(e);
      res.status(403).render("signupdoctor", {
        title: "Sign Up",
        userInfo: newUser,
        errors: errors,
      });
    }
  });
  


  router.get("/home", authMiddleware, async (req, res) => {
    res.render('doctors/doctorhomepage')
    });
   
router.get("/profile", authMiddleware,async (req, res) => {
    //sample
   res.render('doctors/doctorProfile')
    });
  
module.exports = router;