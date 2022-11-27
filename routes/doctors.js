
const express = require("express");
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
  res.render('login',{doctor:true,path:'/doctors'})
  })
  .post(async(req,res)=> {
  return res.redirect('/doctors/home')
   
  })

  router.get("/home", async (req, res) => {
    res.render('doctorhomepage')
    });
   
router.get("/profile", async (req, res) => {
    //sample
    if(!req.session.user){
        res.send("Please login to continue")
    }
    });
  
module.exports = router;