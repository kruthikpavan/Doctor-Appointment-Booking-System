const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  res.redirect('/')
  });
  router.get("/profile", async (req, res) => {
    //sample
    if(!req.session.user){
        res.send("Please login to continue")
    }
    });
module.exports = router;