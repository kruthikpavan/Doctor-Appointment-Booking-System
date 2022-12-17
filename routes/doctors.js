const express = require("express");
const xss = require("xss");
const data = require("../data");
const validator = require("../validation");
const router = express.Router();
const userData = data.doctors;
const authMiddleware = (req, res, next) => {
  if (req.session.doctors) {
    next();
  } else {
    return res.redirect("/doctors");
  }
};
router
  .route("/")
  .get(async (req, res) => {
    if (req.session.doctors) return res.redirect("/doctors/home");
    return res.render("login", { doctor: true, path: "/doctors" });
  })
  .post(async (req, res) => {const {username,password}= req.body
    if(!username || !password) {
      res.status(400)
      res.render('login',{error:'Both username and password needs to be provided'})
      return
    }
    if(username.length<4){
      res.status(400)
      res.render('login',{error:'Username should have atleast 4 characters'})
      return
    }
   const docInfo= await userData.checkDoctor(username,password)
   if(docInfo){
    req.session.doctors=docInfo.name;
    res.redirect('/doctors/home')
    return
   }
   else{
    res.render('login',{error:'Not a valid username and password '})
    return
   }
  
    
  });

router.post("/signup", async (req, res) => {
  let errors = [];
  let dateOfBirthConvert = xss(req.body.dateOfBirth.trim());
  let parts = dateOfBirthConvert.split("-");
  dateOfBirthConvert = `${parts[1]}/${parts[2]}/${parts[0]}`;
  let newUser = {
    name: xss(req.body.name.trim()),
    password: xss(req.body.password.trim()),
    email: xss(req.body.email.trim()),
    phoneNumber: xss(req.body.phoneNumber.trim()),
    dateOfBirth: dateOfBirthConvert,
    gender: xss(req.body.gender.trim()),
    category: xss(req.body.category.trim()),
    qualification: xss(req.body.qualification.trim()),
  };
  console.log("NEW USER: ");
  console.log(newUser);

  if (!validator.validString(newUser.name)) errors.push("Invalid name.");

  if (!validator.validPassword(newUser.password))
    errors.push("Invalid password.");
  if (!validator.validEmail(newUser.email)) errors.push("Invalid email.");
  if (!validator.validDate(newUser.dateOfBirth))
    errors.push("Invalid Date of Birth.");

  if (!validator.validString(newUser.category))
    errors.push("Invalid category.");
  if (!validator.validString(newUser.qualification))
    errors.push("Invalid qualification.");
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
      "", //hospital
      newUser.dateOfBirth,
      newUser.gender, //gender
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
  res.render("doctors/doctorhomepage");
});

router.get("/profile", async (req, res) => {
  if (!req.session.doctors) {
    return res.redirect("/doctors");
  }
  let user = await userData.getDoctorByName(req.session.doctors);
  if (user === null) {
    return res.render("error/404");
  }
  return res.render("doctors/Profile", {
    layout: "main",
    title: "My Profile",
    userInfo: user,
  });
});
router.post("/profile", async (req, res) => {
  let errors = [];

  let userInfo = {
    name: xss(req.body.name.trim()),
    email: xss(req.body.email.trim()),
    phoneNumber: xss(req.body.phoneNumber.trim()),
    dateOfBirth: xss(req.body.dateOfBirth.trim()),
    gender: xss(req.body.gender.trim()),
    category: xss(req.body.category.trim()),
    qualification: xss(req.body.qualification.trim()),
  };

  if (!validator.validString(userInfo.name)) errors.push("Invalid name.");


  if (!validator.validEmail(userInfo.email)) errors.push("Invalid email.");
  if (!validator.validDate(userInfo.dateOfBirth))
    errors.push("Invalid Date of Birth.");

  if (!validator.validString(userInfo.category))
    errors.push("Invalid category.");
  if (!validator.validString(userInfo.qualification))
    errors.push("Invalid qualification.");
 

    if (!req.session.doctors) {
      res.redirect("/doctors");
    }
    if (errors.length > 0) {
      console.log(errors);
      return res.status(401).render("doctors/profile", {
        title: "My Profile",
        userInfo: userInfo,
        errors: errors,
      });
    }

    try {
      const updatedUser = await userData.updateProfile(
        req.session.doctors._id,
        userInfo.name,
        userInfo.category,
        userInfo.qualification,
        "", //hospital
        userInfo.dateOfBirth,
        userInfo.gender, //gender
        userInfo.email,
        userInfo.phoneNumber
      );
      if (updatedUser) {
        req.session.doctors = updatedUser;
        res.status(200).render("doctors/profile", {
          title: "My Profile",
          userInfo: updatedUser,
          errors: errors,
          msg: "Successfully updated",
        });
      } else {
        res.render("doctors/profile", {
          title: "My Profile",
          userInfo: userInfo,
          msg: "Could not  update your profile.",
        });
      }
    } catch (e) {
      errors.push(e);
      res.status(403).render("doctors/profile", {
        title: "My Profile",
        userInfo: userInfo,
        errors: errors,
      });
    }
  
})
;



//reviews

router
  .route("/reviews")
  .get(async (req, res) => {
    const doctor= await userData.getDoctorByID(req.session.doctors)
    return res.render('doctors/doctor-reviews', {reviews:doctor.reviews})
  })
  .post(async (req, res) => {
    req.session.doctors=xss(req.body.hiddenReview)
    return res.redirect('/doctors/reviews')

})

module.exports = router;
