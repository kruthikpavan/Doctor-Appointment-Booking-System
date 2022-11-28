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
    res.render('userhomepage')
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
      let todayDate=  `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
      let date = new Date();
let result = date.setDate(date.getDate() + 30);
let lastDay= new Date(result)
let finalDate=  `${lastDay.getFullYear()}-${lastDay.getMonth()+1}-${lastDay.getDate()}`
      console.log(todayDate);
      res.render('book-appointment',{today:todayDate,lastDate:finalDate})
      })
      .post(async(req,res)=> {
      return res.redirect('/users/home')
      })
 
    

module.exports = router;