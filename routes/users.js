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
      return res.redirect('/users/home')
      })
 
    

module.exports = router;