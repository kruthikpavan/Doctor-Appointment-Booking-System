const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  res.redirect("/");
});

router
  .route("/login")
  .get(async (req, res) => {
<<<<<<< Updated upstream
    res.render("login", { doctor: false, path: "/users/login" });
  })
  .post(async (req, res) => {
    return res.redirect("/users/home");
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
    gender: xss(req.body.gender.toLowerCase().trim()),
    city: xss(req.body.city.toLowerCase().trim()),
    state: xss(req.body.state.toLowerCase().trim()),
    age: xss(req.body.age.toLowerCase().trim()),
    dateOfBirth: dateOfBirthConvert,
  };
  console.log("NEW USER: ");
  console.log(newUser);

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
  if (!validator.validAge(newUser.dateOfBirth)) errors.push("Invalid Age.");

  console.log("HERE WE GO.Z");

  const userCheck = await userData.getUserByID(newUser._id);
  try {
    if (userCheck) throw "Username already in use.";
  } catch (e) {
    errors.push(e);
    // return res.status(401).render("users/signup", {
    //   title: "Sign Up",
    //   errors: errors,
    //   signupInfo: newUser,
    // });
  }

  if (errors.length > 0) {
    console.log(errors);
    return res.status(401).json({ errors: errors });
  }

  try {
    const addedUser = await userData.createUser(
      newUser.firstName,
      newUser.lastName,
      newUser.username,
      newUser.password,
      newUser.email,
      newUser.gender,
      newUser.city,
      newUser.state,
      newUser.age,
      newUser.dateOfBirth
    );

    req.session.user = {
      _id: addedUser._id,
      firstName: addedUser.firstName,
      lastName: addedUser.lastName,
      username: addedUser.username,
      email: addedUser.email,
      gender: addedUser.gender,
      city: addedUser.city,
      state: addedUser.state,
      age: addedUser.age,
      dateOfBirth: addedUser.dateOfBirth,
      appointments: addedUser.appointments,
    };
    console.log(req.session.user);
    res.redirect("book-appoinment");
  } catch (e) {
    errors.push(e);
    res.status(403).render("/signup", {
      title: signUp,
      userInfo: newUser,
      errors: errors,
=======
    res.render('login',{doctor:false,path:'/users/login'})
    })
    .post(async(req,res)=> {
      //to-do
      //after authenticating the user we will create a req.session.username with the username of user
      //we will use this info to fetch user's appointment and profile data from database in other routes
    return res.redirect('/users/home')
    })


  router.get('/home',async (req, res) => {
    res.render('users/userhomepage')
    })
  

  router.get("/profile", async (req, res) => {
    //sample
    if(!req.session.user){
        res.send("Please login to continue")
    }
>>>>>>> Stashed changes
    });
  }
});

router.get("/profile", async (req, res) => {
  //sample
  if (!req.session.user) {
    res.send("Please login to continue");
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
      //todo- fetch a
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
    const data = req.body;
    res.send("Booking Success!!");
  });

<<<<<<< Updated upstream
module.exports = router;
=======

    router
    .route('/book-appointment')
    .get(async (req, res) => {
      let date = new Date();
      let currentMonth= `${new Date().getMonth()+1}`
      if(currentMonth.toString().length==1) currentMonth=`0${currentMonth}`
      let currentDay= `${new Date().getDate()}`
      if(currentDay.toString().length==1) currentDay=`0${currentDay}`
      let currentDate= `${new Date().getFullYear()}-${currentMonth}-${currentDay}`
      let result = date.setDate(date.getDate() + 30);
      let lastDate= new Date(result)
      let lastMonth= `${lastDate.getMonth()+1}`
      if(lastMonth.toString().length==1) lastMonth=`0${lastMonth}`
      let lastDay= `${lastDate.getDate()}`
      if(lastDay.toString().length==1) lastDay=`0${lastDay}`
      lastDate= `${lastDate.getFullYear()}-${lastMonth}-${lastDay}`
      res.render('users/book-appointment',{today:currentDate,lastDate:lastDate})
      })
      .post(async(req,res)=> {
        const date= req.body.date
        //to-do
        //Need to check if date is provided or not. If not re-render same page with error specified
        //Next step is to fetch available slots for specified date. Will use dummy data for now---pk
        //If available slots are empty, redirect to book-appointment route. User has to select a different date to proceed
        req.session.date= date
        req.session.availableSlots= {
          slots: [{time: 9, available: true},{time: 10,available:false},{time:11,available:true},{time:12,available:false}]
        }
        return res.render('users/select-slot',{availableSlots:req.session.availableSlots})


      })
 
      router
      .route('/select-slot')
      .get(async (req, res) => {
        return res.redirect('/users/book-appointment')
        })
        .post(async(req,res)=> {
          //if req.body is empty redirect to /select-slot page with error . User has to select atleast one slot
          if(Object.keys(req.body).length === 0) 
          {
            
            return res.render('users/select-slot',{error:'You need to select atleast one slot to complete the booking',availableSlots:req.session.availableSlots})
          }
          if(Object.keys(req.body).length >1){
            return res.render('users/select-slot',{error:'You cant select multiple slots. Please select only one available slot',availableSlots:req.session.availableSlots})
          }
          let timeSlot= undefined
          for(const key in req.body){
             timeSlot= parseInt(key)
          }
          //to-do
          //store this timeslot and date from req.session.date as appointment info in database
          res.render('users/my-appointments',{timeSlot:timeSlot,date:req.session.date})

          
        })


        router
      .route('/my-appointments')
      .get(async (req, res) => {
        //appointment data need to be fetched from the database and displayed to the user
        const timeSlot= req.body.timeSlot
        const date= req.body.date     //these are temporary. date needs to be fetched from database not session
        //implementing if else to check if user accessed this route without selecting date and timeslot
        if(!timeSlot || !date){
          return res.redirect('/users/book-appointment')
        }
        res.render('users/my-appointments',{timeSlot:timeSlot,date:req.session.date})
    
        })
        .post(async(req,res)=> {
          //to-do
          //Implement logic to remove appointment from database . timeslot and date are present in req.session
          delete req.session[req.session.date];
          delete req.session[req.session.timeSlot];
          return res.redirect('/users/home')

  
          
        })
   
      















module.exports = router;
>>>>>>> Stashed changes
