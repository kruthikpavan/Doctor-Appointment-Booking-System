const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect("/users/home");
        return;
    }else if(req.session.doctors){
        res.redirect("/doctors/home");
        return;
    }else{  res.render('home',
    {
        title: 'Doctor Appointment Booking',
    });}
});

module.exports = router;
