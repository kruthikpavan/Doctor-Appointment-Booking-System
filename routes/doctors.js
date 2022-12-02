
const express = require("express");
const router = express.Router();
const authMiddleware = (req,res,next)=>{
    if(req.session.doctors){
        next()
    }
    else{
        return res.redirect('/doctors')
    }
}
router
.route('/')
.get(async (req, res) => {
    if(req.session.doctors) return res.redirect('/doctors/home')
  return res.render('login',{doctor:true,path:'/doctors'})

  })
  .post(async(req,res)=> {
    req.session.doctors= 'doctorLoggedIn'
  return res.redirect('/doctors/home')
   
  })

  router.get("/home", authMiddleware, async (req, res) => {
    res.render('doctors/doctorhomepage')
    });
   
router.get("/profile", authMiddleware,async (req, res) => {
    //sample
   res.render('doctors/doctorProfile')
    });
  
module.exports = router;