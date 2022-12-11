const express = require("express");
const xss = require('xss')
const data = require('../data');
const validator=require("../validation") 
const router = express.Router();
const userData = data.users;
const appointmentData= data.appointments

router.get("/", async (req, res) => {
  res.redirect("/");
});
router
  .route("/login")
  .get(async (req, res) => {
    res.render("login", { doctor: false, path: "/users/login" });
  })
  .post(async (req, res) => 
  {const {username,password}= req.body
  if(!username || !password) {
    res.status(400)
    res.render('login',{error:'Both username and password needs to be provided'})
    return
  }
  if(!/^[a-z0-9]+$/i.test(username)){
    res.status(400)

    res.render('login',{error:'Only alpha numeric characters should be provided as username.No other characters or empty spaces are allowed'})
    return
  }
  if(username.length<4){
    res.status(400)
    res.render('login',{error:'Username should have atleast 4 characters'})
    return
  }
 const userInfo= await userData.checkUser(username,password)
 if(userInfo){
  req.session.user=username;
  res.redirect('/users/home')
  return
 }
 else{
  res.render('login',{error:'Not a valid username and password '})
  return
 }

  });
router.get("/home", async (req, res) => {
  res.render("users/userhomepage");
});

router.get("/signup", async (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

router.post("/signup", async (req, res) => {
  let errors = [];
  let dateOfBirthConvert = xss(req.body.dateOfBirth.trim());
  let parts = dateOfBirthConvert.split("-");
  dateOfBirthConvert = `${parts[1]}/${parts[2]}/${parts[0]}`;
  let newUser = {
    firstName: xss(req.body.firstName.trim()),
    lastName: xss(req.body.lastName.trim()),
    username: xss(req.body.username.toLowerCase().trim()),
    password: xss(req.body.password.trim()),
    email: xss(req.body.email.toLowerCase().trim()),
    phoneNumber: xss(req.body.phoneNumber.trim()),
    dateOfBirth: dateOfBirthConvert,
  };
 
 

  if (!validator.validString(newUser.firstName))
    errors.push("Invalid first name.");
  if (!validator.validString(newUser.lastName))
    errors.push("Invalid last name.");
  if (!validator.validString(newUser.username))
    errors.push("Invalid username.");
  if (!validator.validPassword(newUser.password))
    errors.push("Invalid password.");
  if (!validator.validEmail(newUser.email)) errors.push("Invalid email.");
  if (!validator.validDate(newUser.dateOfBirth))
    errors.push("Invalid Date of Birth.");

  if (errors.length > 0) {
    console.log(errors);
    return res.status(401).render("signup", {
      title: "Sign Up",
      userInfo: newUser,
      errors: errors,
    });
  }
  try {
    const addedUser = await userData.createUser(
      newUser.firstName,
      newUser.lastName,
      newUser.username,
      newUser.password,
      newUser.email,
      newUser.phoneNumber,
      newUser.dateOfBirth
    );
    res.redirect("/users/home");
  } catch (e) {
    errors.push(e);
    res.status(403).render("signup", {
      title: "Sign Up",
      userInfo: newUser,
      errors: errors,
    });
  }
});


router
  .route("/book-appointment")
  .get(async (req, res) => {
    let date = new Date();
    let currentMonth = `${new Date().getMonth() + 1}`;
    if (currentMonth.toString().length == 1) currentMonth = `0${currentMonth}`;
    let currentDay = `${new Date().getDate()}`;
    if (currentDay.toString().length == 1) currentDay = `0${currentDay}`;
    let currentDate = `${new Date().getFullYear()}-${currentMonth}-${currentDay}`;
    let result = date.setDate(date.getDate() + 30);
    let lastDate = new Date(result);
    let lastMonth = `${lastDate.getMonth() + 1}`;
    if (lastMonth.toString().length == 1) lastMonth = `0${lastMonth}`;
    let lastDay = `${lastDate.getDate()}`;
    if (lastDay.toString().length == 1) lastDay = `0${lastDay}`;
    lastDate = `${lastDate.getFullYear()}-${lastMonth}-${lastDay}`;
    res.render("users/book-appointment", {
      today: currentDate,
      lastDate: lastDate,
    });
  })
  .post(async (req, res) => {
    const date = req.body.date;
    //to-do
    //Need to check if date is provided or not. If not re-render same page with error specified
    //Next step is to fetch available slots for specified date. Will use dummy data for now---pk
    //If available slots are empty, redirect to book-appointment route. User has to select a different date to proceed
    req.session.date= date
    req.session.availableSlots = {
      slots: [
        { time: 9, available: true },
        { time: 10, available: false },
        { time: 11, available: true },
        { time: 12, available: false },
      ],
    };
    return res.render("users/select-slot", {
      availableSlots: req.session.availableSlots,
    });
  });

router
  .route("/select-slot")
  .get(async (req, res) => {
    return res.redirect("/users/book-appointment");
  })
  .post(async (req, res) => {
    //to-do
    //if req.body is empty redirect to /select-slot page with error . User has to select atleast one slot
    if (Object.keys(req.body).length === 0) {
      return res.render("users/select-slot", {
        error: "You need to select atleast one slot to complete the booking",
        availableSlots: req.session.availableSlots,
      });
    }
    if (Object.keys(req.body).length > 1) {
      return res.render("users/select-slot", {
        error:
          "You cant select multiple slots. Please select only one available slot",
        availableSlots: req.session.availableSlots,
      });
    }
    let timeSlot= undefined
        for(const key in req.body){
             timeSlot= parseInt(key)
          }
          req.session.timeSlot= timeSlot
          //to-do
          //store this timeslot and date from req.session.date as appointment info in database
          const doctorId= 'randomDoctor'
          const appointment= await appointmentData.createAppointment(req.session.user, doctorId, timeSlot, req.session.date)
          res.redirect('/users/my-appointments')
  });
  router
      .route('/my-appointments')
      .get(async (req, res) => {
        //appointment data need to be fetched from the database and displayed to the user
        const appointmentInfo= await appointmentData.getAppointmentByID(req.session.user)
        if(!appointmentInfo){
          return res.send('You dont have any appointments right now!')
        }
        const timeSlot= appointmentInfo.timeSlot
        const date= appointmentInfo.date    //these are temporary. date and timeSlot needs to be fetched from database not session
        res.render('users/my-appointments',{timeSlot,date})
        })
        .post(async(req,res)=> {
          //to-do
          //Implement logic to remove appointment from database . timeslot and date are present in req.session
         const appointmentDeleted= await appointmentData.removeAppointment()
          return res.redirect('/users/home')
 
        })

        router.get("/profile", async (req, res) => {
          if (!req.session.user) {
      
              return res.redirect("login");
          }
          let user = await userData.getUserByID(req.session.user._id);
          if (user === null) {
              return res.render('error/404');
          }
          return res.render('users/Profile', {
              layout: 'main',
              title: "My Profile",
              userInfo: user,
          });
      });
      router.post("/profile", async (req, res) => {
        let errors = [];
      
        let userInfo = {
          firstName: xss(req.body.firstName.trim()),
          lastName: xss(req.body.lastName.trim()),
          username: xss(req.body.username.toLowerCase().trim()),
          email: xss(req.body.email.toLowerCase().trim()),
          phoneNumber: xss(req.body.phoneNumber.trim()),
          dateOfBirth: xss(req.body.dateOfBirth.trim()),
        };
        if (!validator.validString(userInfo.firstName))
          errors.push("Invalid first name.");
        if (!validator.validString(userInfo.lastName))
          errors.push("Invalid last name.");
        if (!validator.validString(userInfo.username))
          errors.push("Invalid username.");
      
        if (!validator.validEmail(userInfo.email)) errors.push("Invalid email.");
        if (!validator.validDate(userInfo.dateOfBirth))
        {
          userInfo.dateOfBirth=req.body.dateOfBirth.trim();
          errors.push("Invalid Date of Birth.");
        }
      
        if (!req.session.user) {
            res.redirect("login")
        }
        if (errors.length > 0) {
          console.log(errors);
          return res.status(401).render("users/profile", {
            title: "My Profile",
            userInfo: userInfo,
            errors: errors,
          });
        }

        try {
          const updatedUser = await userData.updateProfile(
            req.session.user._id,
            userInfo.firstName,
            userInfo.lastName,
            userInfo.username,
            userInfo.email,
            userInfo.phoneNumber,
            userInfo.dateOfBirth
          );
          if(updatedUser)
          {
            req.session.user=updatedUser;
            res.status(200).render("users/profile", {
              title: "My Profile",
              userInfo: updatedUser,
              errors: errors,
              msg:"Successfully updated"
            });
          }
          else{
            
            res.render("users/profile", {
              title: "My Profile",
              userInfo: userInfo,
              msg: "Could not  update your profile.",
            });
          }
         
        } catch (e) {
          errors.push(e);
          res.status(403).render("users/profile", {
            title: "My Profile",
            userInfo: userInfo,
            errors: errors,
          });
        }
      });
      
module.exports = router;
