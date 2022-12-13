const express = require("express");
const router = express.Router();
const data = require("../data");
const validate = require("../validation");


const reviewData = data.reviews;

router.route('/')
.get(async(req,res)=>
{
    // let reviewDetails = req.body;
    // try {
    //     let id = req.session.user._id;
    //     if(req.session.user)
    //         res.redirect('/users');
    //     const getReviews = await data.getAllUserReviews(id);
    //     res.status(200).json(getReviews);
    // } catch (e) {
    //     res.status(500).json(e);
    // }
    res.render('review');
})
.post(async (req,res) =>{
    try{
        let id = req.sessionID;
        // let id = req.session.user._id;
        // const reviewData = req.body;
        // if (!ObjectId.isValid(doctorID)) throw 'Invalid Doctor ID';
        // if (!ObjectId.isValid(userID)) throw 'Invalid User ID';
        // if (!ObjectId.isValid(appointmentID)) throw 'Invalid Appointment ID';
        // doctorID = reviewData.doctorID;
        // userID = reviewData.userID;
        review = req.body['review-form'].trim();
        // appointmentID = reviewData.appointmentID;
        // let doctorIDrate = validator.Validid(doctorID);
        // let userIDrate = validator.Validid(userID);
        // let appointmentIDrate = validator.Validid(appointmentID);
        // let reviewrate = validator.validString(review);
        // if(doctorIDrate == false || userIDrate == false || appointmentIDrate== false || reviewrate == false)
        // {
        //     return res.render('reviews',{error:'Not a valid username and password '});
        // }
    }
    catch(e)
    {
    if(typeof e !== 'object')
        return res.status(500).json("Internal server error");
    else
        return res.status(parseInt(e.status)).json(e.error);
    }

    try {
        doctorID = '5ce819935e539c343f141ece';
        userID = '5ce819935e539c343f141ece';
        appointmentID = '5ce819935e539c343f141ece';

        const newReview = await reviewData.createReview(review,doctorID,userID,appointmentID);
        if (!newReview.acknowledged) throw "Could not add review";
        res.status(200).redirect("/users/home");
        } catch (e) {
        if(typeof e !== 'object')
        return res.status(500).json("Internal server error");
    else
        return res.status(parseInt(e.status)).json(e.error);
    }
})

module.exports = router;