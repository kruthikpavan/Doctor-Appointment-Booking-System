const express = require("express");
const { LoggerLevel } = require("mongodb");
const xss = require("xss");
const data = require("../data");
const validator = require("../validation");
const router = express.Router();
const userData = data.users;
const appointmentData = data.appointments;
const doctorData= data.doctors
const reviewData= data.reviews

const fetchAvailableSlots=async(doctor,date)=>{
  let d = new Date();
  let h = d.getHours();
  let min = d.getMinutes();
  let Ntime = h;
  let availableSlots=[]
  let AllSlots = {
    slots: [
    
      { time: '4.17' },
      { time: '10' },
      { time: '10.30' },
      { time: '11' },
      { time: '11.30' },
      { time: '12' },
      { time: '12.30' },
      { time: '13' },
      { time: '13.30' },
      { time: '16' },
      { time: '16.30' },
      { time: '17' },
      { time: '17.30' },
      { time: '18' },
      { time: '18.30' },
      { time: '19' },
      { time: '19:30' },
     

    ],
  };
  for (const slot of AllSlots.slots) {
    let doctorAvailable= await doctorData.checkSlot(doctor,date,slot.time)
    if(doctorAvailable){
      let obj={time: slot.time}
      let todayDate= new Date().getDate()
        let selectedDate = date.slice(-2);
        if(selectedDate==todayDate){
          //if(parseFloat(slot.time).toFixed(2) > parseFloat(Ntime).toFixed(2))
          if((parseFloat(slot.time))>parseFloat(Ntime))
          {
            availableSlots.push(obj)
          }
        }
        else
        {
          availableSlots.push(obj)
        }
    }
  }
  return availableSlots;
}

Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/users/login");
  }
};
router.get("/", async (req, res) => {
  res.redirect("/");
});
router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) return res.redirect("/users/home");
    return res.render("login", { doctor: false, path: "/users/login", title: "userlogin" });
  })
  .post(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      res.render("login", {
        doctor: false, path: "/users/login",
        error: "Both username and password needs to be provided",
        title:"userlogin"
      });
      return;
    }
    if (!/^[a-z0-9]+$/i.test(username)) {
      res.status(400);

      res.render("login", {
        doctor: false, path: "/users/login",
        error:
          "Only alpha numeric characters should be provided as username.No other characters or empty spaces are allowed",
          title:"userlogin"
      });
      return;
    }
    if (username.length < 4) {
      res.status(400);
      res.render("login", {
        doctor: false, path: "/users/login",
        error: "Username should have atleast 4 characters",
        title:"userlogin"
      });
      return;
    }
    const userInfo = await userData.checkUser(username, password);
    if (userInfo) {
      req.session.user = username;
      res.redirect("/users/home");
      return;
    } else {
      res.render("login", {
        doctor: false, path: "/users/login",
         error: "Not a valid username and password ", title:"userlogin" });
      return;
    }
  });
router.get("/home",authMiddleware,async (req, res) => {
  if(req.session.doctors){
    delete req.session.doctors;
  }
  res.render("users/userhomepage",{loggedIn:true,title:"userhomepage"});
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
    if (!validator.validPhoneNumber(newUser.phoneNumber))
    errors.push("Invalid phone");
    
   

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
    req.session.user= newUser.username
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
  .route("/book-appointment",authMiddleware)
  .get(authMiddleware,async (req, res) => {
    
    let date = new Date();
    console.log(req.session);
    let currentMonth = `${new Date().getMonth() + 1}`;
    if (currentMonth.toString().length == 1) currentMonth = `0${currentMonth}`;
    let currentDay = `${new Date().getDate()}`;
    if (currentDay.toString().length == 1) currentDay = `0${currentDay}`;
    let currentDate = `${new Date().getFullYear()}-${currentMonth}-${currentDay}`;
    let result = date.setDate(date.getDate() + 14);
    let lastDate = new Date(result);
    let lastMonth = `${lastDate.getMonth() + 1}`;
    if (lastMonth.toString().length == 1) lastMonth = `0${lastMonth}`;
    let lastDay = `${lastDate.getDate()}`;
    if (lastDay.toString().length == 1) lastDay = `0${lastDay}`;
    lastDate = `${lastDate.getFullYear()}-${lastMonth}-${lastDay}`;
    req.session.today= currentDate
    req.session.lastDate= lastDate
    res.render("users/book-appointment", {
      today: currentDate,
      lastDate: lastDate,
      loggedIn:true,
      title:"user-bookappointment"
    });
  })
  .post(authMiddleware,async (req, res) => {
    console.log(req.session);
    if(!req.session.doctors){
      req.session.doctors= req.body.hidden
   
      return  res.redirect("/users/book-appointment");
    }
    if(req.body.hidden){
      console.log(req.body);
      if(req.body.hidden!=req.session.doctors){
        req.session.doctors= req.body.hidden
        return  res.redirect("/users/book-appointment");
      }
    }
    const date = req.body.date;
    const checkIfBooked = await appointmentData.checkStatus(req.session.user)
    if(checkIfBooked) {
      return res.render("users/book-appointment", {
        error:'You already have an existing slot.',
        today: req.session.today,
      lastDate: req.session.lastDate,
      loggedIn:true,
      title:"user-bookappointment"
      });
    }
    //to-do
    //Next step is to fetch available slots for specified date. Will use dummy data for now---pk
    //If available slots are empty, redirect to book-appointment route. User has to select a different date to proceed
    req.session.date = date;
   
    const availableSlots= await fetchAvailableSlots(req.session.doctors,date)

    if(availableSlots.length == 0) {
      return res.render("users/book-appointment", {
        error:'No more slots available for today.',
        today: req.session.today,
      lastDate: req.session.lastDate,
      loggedIn:true,
      title:"user-bookappointment"

      });
    }

    let allAvailableSlots= {slots:availableSlots}
    return res.render("users/select-slot", {
      availableSlots: allAvailableSlots, doctor: req.session.doctors,loggedIn:true,
      title:"user-select-slots"
    });
  
   
  });

router
  .route("/select-slot",authMiddleware)
  .get(authMiddleware,async (req, res) => {
    return res.redirect("/users/book-appointment");
  })
  .post(async (req, res) => {
    //to-do
    //if req.body is empty redirect to /select-slot page with error . User has to select atleast one slot
    
// !!!Pass available slots to same page.
    if (Object.keys(req.body).length === 0) {
      return res.render("users/select-slot", {
        error: "You need to select atleast one slot to complete the booking",
        availableSlots: req.session.availableSlots,
        loggedIn:true,
        title:"users-select-slot"
      });
    }
    if (Object.keys(req.body).length > 1) {
      return res.render("users/select-slot", {
        error:
          "You cant select multiple slots. Please select only one available slot",
        availableSlots: req.session.availableSlots,loggedIn:true,
        title:"users-select-slot"
      });
    }
    let timeSlot = undefined;
    for (const key in req.body) {
      timeSlot = parseFloat(key).toFixed(2);
    }
    req.session.timeSlot = timeSlot;
    //to-do
    //store this timeslot and date from req.session.date as appointment info in database
    const doctorId = req.session.doctors;
    const appointment = await appointmentData.createAppointment(
      req.session.user,
      doctorId,
      
      timeSlot,
      req.session.date
    );
    //push this appointment date and time into doctors db
    const blockDate= await doctorData.blockAppointment(doctorId,req.session.date,timeSlot)
    res.redirect("/users/my-appointments");
  });
router
  .route("/my-appointments",authMiddleware)
  .get(authMiddleware,async (req, res) => {
    //appointment data need to be fetched from the database and displayed to the user
    const appointmentInfo = await appointmentData.getAppointmentByID(
      req.session.user
    );
    if (!appointmentInfo) {
      return res.send("You dont have any appointments right now!");
    }
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    let timeNow= `${currentHour}.${currentMinute}`
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth()+1;
    const currentDay = currentDate.getDate();
    let dateNow= `${currentYear}-${currentMonth}-${currentDay}`
    appointmentInfo.forEach(doc=>{
          if(dateNow==doc.date){
            if(parseFloat(timeNow)>parseFloat(doc.timeSlot)){
              doc.fulfilled=true
            }
          }
    })
    const updateAppointment= await appointmentData.updateFulfilled(req.session.user)

    res.render("users/my-appointments", { appointments: appointmentInfo ,loggedIn:true,title:"users-my-appointments"});
  })
  .post(async (req, res) => {
    //to-do
    //Implement logic to remove appointment from database . timeslot and date are present in req.session
    const appointmentDeleted = await appointmentData.removeAppointment(req.session.user);
    return res.redirect("/users/home");
  });

router.get("/profile", authMiddleware,async (req, res) => {
  if (!req.session.user) {
    return res.redirect("login");
  }
  let user = await userData.getUserByUn(req.session.user.toLowerCase());

  if (user === null) {
    return res.render("error/404");
  }
  return res.render("users/Profile", {
    layout: "main",
    title: "My Profile",
    userInfo: user,
    loggedIn:true
  });
});
router.post("/profile",authMiddleware, async (req, res) => {
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
  if (!validator.validDate(userInfo.dateOfBirth)) {
    userInfo.dateOfBirth = req.body.dateOfBirth.trim();
    errors.push("Invalid Date of Birth.");
  }

  if (!req.session.user) {
    res.redirect("login");
  }
  if (errors.length > 0) {
    console.log(errors);
    return res.status(401).render("users/profile", {
      title: "My Profile",
      userInfo: userInfo,
      errors: errors,
      loggedIn:true
    });
  }

  try {
    let updatedUser = await userData.updateProfile(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.username,
      userInfo.email,
      userInfo.phoneNumber,
      userInfo.dateOfBirth
    );
    if (updatedUser) {
      req.session.user = updatedUser;
      res.status(200).render("users/profile", {
        title: "My Profile",
        userInfo: updatedUser,
        errors: errors,
        msg: "Successfully updated",
      });
    } else {
      res.render("users/profile", {
        title: "My Profile",
        userInfo: userInfo,
        msg: "Could not  update your profile.",
        loggedIn:true
      });
    }
  } catch (e) {
    errors.push(e);
    res.status(403).render("users/profile", {
      title: "My Profile",
      userInfo: userInfo,
      errors: errors,
      loggedIn:true
    });
  }
});


router
  .route("/review")
  //needs enew handlebar wthout date
  .get(authMiddleware,async (req, res) => {

   // let reviewDetails = req.body;
    // try {
    //     let id = req.session.user._id;
    //     if(req.session.user)
    //         res.redirect('/users');
    //     const getReviews = await data.getAllUserReviews(id);
    //     res.status(200).json(getReviews);
    // } catch (e) {
    //     res.status(500).json(e);
    // }
    res.render("review",{ loggedIn:true,title:"review"});
  })
  .post(authMiddleware,async (req,res) =>{
    try{
      let doctorId = undefined
      if(req.body.hidden){
        console.log(req.body.hidden);
        doctorID= req.body.hidden
        res.redirect('/users/review')
        return
      }
     
      // let id = req.session.user._id;
      // const reviewData = req.body;
      // if (!ObjectId.isValid(doctorID)) throw 'Invalid Doctor ID';
      // if (!ObjectId.isValid(userID)) throw 'Invalid User ID';
      // if (!ObjectId.isValid(appointmentID)) throw 'Invalid Appointment ID';
      // doctorID = reviewData.doctorID;
      // userID = reviewData.userID;
      review = req.body['review-form'].trim();
      console.log(review);
      // appointmentID = reviewData.appointmentID;
      // let doctorIDrate = validator.Validid(doctorID);
      // let userIDrate = validator.Validid(userID);
      // let appointmentIDrate = validator.Validid(appointmentID);
      // let reviewrate = validator.validString(review);
      // if(doctorIDrate == false || userIDrate == false || appointmentIDrate== false || reviewrate == false)
      // {
      //     return res.render('reviews',{error:'Not a valid username and password '});
      // }
  }
  catch(e)
  {
  if(typeof e !== 'object')
      return res.status(500).json("Internal server error");
  else
      return res.status(parseInt(e.status)).json(e.error);
  }

  try {
      const newReview = await reviewData.createReview(review,doctorID);
      const changeKey= await appointmentData.updateAppointment(req.session.user)
      //if (!newReview.acknowledged) throw "Could not add review";
      res.status(200).redirect("/users/home");
      } catch (e) {
      if(typeof e !== 'object')
      return res.status(500).json("Internal server error");
  else
      return res.status(parseInt(e.status)).json(e.error);
  }
  })
router
  .route("/reschedule")
  //needs enew handlebar wthout date
  .get(authMiddleware,async (req, res) => {

    const appointments= await appointmentData.getAppointmentByID(req.session.user)
    let date= undefined
    let doctor= undefined
    if(appointments.length>0){
      appointments.forEach(appointment=>{
        if(appointment.fulfilled==false){
            date= appointment.date
            doctor= appointment.doctorId
        }
      })
    }
    let availableSlots= await fetchAvailableSlots(doctor,date)
    
    if(availableSlots.length == 0) {
      return res.render("users/rescheduleslots", {
        error:'No more slots available for today.',
        today: req.session.today,
      lastDate: req.session.lastDate,
      loggedIn:true,
      title:"recheduleslots"
      });
    }

    let allAvailableSlots= {slots:availableSlots}
    return res.render("users/rescheduleslots", {
      
      availableSlots: allAvailableSlots, doctor: doctor,loggedIn:true,
      title:"reschedulesots"
    });
  })
  .post(authMiddleware,async (req,res) =>{
    //to-do
    //if req.body is empty redirect to /select-slot page with error . User has to select atleast one slot
    const appointments= await appointmentData.getAppointmentByID(req.session.user)
    let date= undefined
    let doctor= undefined
    let pastTime= undefined
    if(appointments.length>0){
      appointments.forEach(appointment=>{
        if(appointment.fulfilled==false){
            date= appointment.date
            doctor= appointment.doctorId
            pastTime= appointment.timeSlot

        }
      })
    }
    const availableSlots= await fetchAvailableSlots(doctor,date)
    let allAvailableSlots= {slots:availableSlots}
    if(Object.keys(req.body).length === 0){
      return res.render("users/rescheduleslots",{
        error: "No option was selected in Reschedule",
        availableSlots: allAvailableSlots,title:"reschedulesots"
      });
    }
    if(Object.keys(req.body).length > 1)
    {
      return res.render('users/rescheduleslots',
      {
        error:
        "You cant select multiple slots. Please select only one available slot",
      availableSlots: allAvailableSlots,title:"reschedulesots"
      })
    }

    let timeslot = undefined;
    for(const key in req.body){
      timeslot = parseFloat(key).toFixed(2);
    }
 
    //to do - store timeslot and data from req.sesion.date as appointment info in db
    //this will remove previous blocked slot from db
    // use this later
     const updatedDoctor= await doctorData.addRescheduleRequest(doctor,date,pastTime,timeslot,req.session.user)
    if(!updatedDoctor){
      let error='You already requested for a reschedule please wait for the doctor to review it'
      return res.render("users/rescheduleslots", {
      
        error:error, doctor: doctor,loggedIn:true,title:"reschedulesots"
      });
    }

    let rescheduleRequested = true;
    const updateKey= await appointmentData.reqrescheduleAppointment(req.session.user,doctor)
     return res.redirect('/users/home')
  });


  router
  .route('/logout')
  .get(async (req, res) => {
    req.session.destroy()
    res.redirect('/')
    return
  })


module.exports = router;