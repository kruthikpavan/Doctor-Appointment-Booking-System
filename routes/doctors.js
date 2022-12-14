const express = require("express");
const xss = require("xss");
const data = require("../data");
const validator = require("../validation");
const router = express.Router();
const userData = data.doctors;
const appointmentData= data.appointments
const authMiddleware = (req, res, next) => {
  if (req.session.doctors) {
    next();
  } else {
    return res.redirect("/doctors");
  }
};

async function approveReschedule(user,doctor,time,reschedule,date,pastTime){
 
  let updatedAppointment= await appointmentData.rescheduleAppointment(user,time,pastTime)
  let deleteRequest= await userData.removeRequest(doctor,user,reschedule)
  let removeBlock= await userData.updateBlockedSlot(doctor,pastTime,date,time)
  return 
}
async function rejectReschedule(user,doctor,time,reschedule){
  let updatedAppointment= await appointmentData.rejectStatus(user)
  let deleteRequest= await userData.removeRequest(doctor,user,reschedule)
return
}

function isToday(year,month,date) {
  let today = new Date();
  return (
    year === today.getFullYear() &&
    month=== today.getMonth()+1 &&
    date === today.getDate()
  );
}
function isEarlierTime(hours,mins) {
  let currentTime = new Date();
  return (
    hours > currentTime.getHours() ||
    (hours === currentTime.getHours() && mins > currentTime.getMinutes())
  );
}
router
  .route("/")
  .get(async (req, res) => {
    if (req.session.doctors) return res.redirect("/doctors/home");
    return res.render("login", { doctor: true, path: "/doctors",title: "doctor-login"});
  })
  .post(async (req, res) => {const {username,password}= req.body
    if(!username || !password) {
      res.status(400)
      res.render('login',{doctor: true, path: "/doctors",error:'Both username and password needs to be provided',title: "doctor-login"})
      return
    }
    if(username.length<4){
      res.status(400)
      res.render('login',{doctor: true, path: "/doctors",error:'Username should have atleast 4 characters',title: "doctor-login"})
      return
    }
   const docInfo= await userData.checkDoctor(username,password)
   if(docInfo){
    req.session.doctors=docInfo.name;
    res.redirect('/doctors/home')
    return
   }
   else{
    res.render('login',{doctor: true, path: "/doctors",error:'Not a valid username and password ',title: "doctor-login"})
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
  res.render("doctors/doctorhomepage",{docloggedIn:true, title:"doctorhomepage"});
});

router.get("/profile",authMiddleware, async (req, res) => {
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
    docloggedIn:true
  });
});
router.post("/profile",authMiddleware, async (req, res) => {
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
        docloggedIn:true
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
          docloggedIn:true
        });
      } else {
        res.render("doctors/profile", {
          title: "My Profile",
          userInfo: userInfo,
          msg: "Could not  update your profile.",
          docloggedIn:true
        });
      }
    } catch (e) {
      errors.push(e);
      res.status(403).render("doctors/profile", {
        title: "My Profile",
        userInfo: userInfo,
        errors: errors,
        docloggedIn:true
      });
    }
  
})
;
//rescheduleRequest

router
  .route("/rescheduleRequest")
  .get(authMiddleware,async (req, res) => {
    const doctor= await userData.getDoctorByID(req.session.doctors)
    let rescheduleRequests= doctor.rescheduleRequests
    let allRequests= {requestList:rescheduleRequests}
    return res.render('doctors/reschedule-requests', {requests:allRequests,title:"reschedulerequests-doctors", docloggedIn:true})
  })
  .post(authMiddleware,async (req, res) => {
    const userId= req.body.hidden
    const btnValue= req.body.btn
    let reschedule= undefined
    const doctor= await userData.getDoctorByID(req.session.doctors)
    let rescheduleRequests= doctor.rescheduleRequests
    const allAppointments= await appointmentData.getAppointmentByID(userId)
    rescheduleRequests.forEach(req=>{
      if(req.user==userId){
        reschedule= req
      }
    })
    let pastTime= reschedule.pastTime
    let resDate= reschedule.date
    let time= reschedule.time
    let resDay=  parseInt(resDate.slice(-2)) 
    let resYear= parseInt(resDate.substring(0,4))
    let resMonth= parseInt(resDate.substring(5,7))
    let resHour= parseInt(time.substring(0,2))
    let resMins= parseInt(time.substring(-2))
    let approveAppointment=undefined
    let rejectAppointment=undefined


    if(isToday(resYear,resMonth,resDay)){
      if(isEarlierTime(resHour,resMins)){
        if(btnValue=='approve'){
          let approveAppointment= await approveReschedule(userId,req.session.doctors,time,reschedule,resDate,pastTime)
          // let updatedAppointment= await appointmentData.rescheduleAppointment(userId,time)
        return res.redirect('/doctors/home')
        }
        else{
          rejectAppointment= await rejectReschedule(userId,req.session.doctors,time,reschedule)
          return res.redirect('/doctors/home')
        }
      }
      else{
        rejectAppointment= await rejectReschedule(userId,req.session.doctors,time,reschedule)
        return res.redirect('/doctors/home')
     
      }
    }
    if(btnValue=='approve'){
      let approveAppointment= await approveReschedule(userId,req.session.doctors,time,reschedule,resDate,pastTime)
      // let updatedAppointment= await appointmentData.rescheduleAppointment(userId,time)
    return res.redirect('/doctors/home')
    }
    else{
      rejectAppointment= await rejectReschedule(userId,req.session.doctors,time,reschedule)
      return res.redirect('/doctors/home')
    }
    // approveAppointment=await approveReschedule(userId,req.session.doctors,time,reschedule)
    // return res.redirect('/doctors/home')

    
   


 
 


    
})

//my appointments
router
  .route("/myAppointments")
  .get(async (req, res) => {
    let doctorData= await appointmentData.getAppointmentByDoctorID(req.session.doctors)
   
    let allDoctors= {data:doctorData}
    return res.render("doctors/my-appointments", { doctorData: allDoctors ,docloggedIn:true,title:"doctors-appointments"});
   
  })
  .post(async (req, res) => {
    req.session.doctors=xss(req.body.hiddenReview)
    return res.redirect('/doctors/reviews')
 
    

})


//reviews

router
  .route("/reviews")
  .get(async (req, res) => {
    const doctor= await userData.getDoctorByID(req.session.doctors)
    return res.render('doctors/doctor-reviews', {reviews:doctor.reviews, loggedIn:true , title:"doctors reviews"})
  })
  .post(async (req, res) => {
    req.session.doctors=xss(req.body.hiddenReview)
    return res.redirect('/doctors/reviews')
 
    
})
router
.route('/logout')
.get(async (req, res) => {
  req.session.destroy()
  res.redirect('/')
  return
})

module.exports = router;
