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
module.exports = router;