const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    
    res.render('home',
        {
            title: 'Doctor Appointment Booking',
        });
});

module.exports = router;
