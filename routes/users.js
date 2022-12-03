const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  res.redirect('/')
  });

  router
  .route('/login')
  .get(async (req, res) => {
    res.render('login',{doctor:false,path:'/users/login'})
    })
    .post(async(req,res)=> {
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
    });



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
          //to-do
          //if req.body is empty redirect to /select-slot page with error . User has to select atleast one slot
          if(Object.keys(req.body).length === 0) 
          {
            //todo- fetch a
            return res.render('users/select-slot',{error:'You need to select atleast one slot to complete the booking',availableSlots:req.session.availableSlots})
          }
          if(Object.keys(req.body).length >1){
            return res.render('users/select-slot',{error:'You cant select multiple slots. Please select only one available slot',availableSlots:req.session.availableSlots})
          }
          const data= req.body
          res.send('Booking Success!!')

          
        })
   
      















module.exports = router;