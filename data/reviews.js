const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');
const helpers = require("../helpers");

async function createReview(reviewData,doctorID,userID,appointmentID){
    if(!reviewData || !doctorID || !userID || !appointmentID) throw 'All fields are mandatory for post review';
    if (!ObjectId.isValid(doctorID)) throw 'Invalid Doctor ID';
    if (!ObjectId.isValid(userID)) throw 'Invalid User ID';
    if (!ObjectId.isValid(appointmentID)) throw 'Invalid Appointment ID';
    if(arguments.length != 6) throw 'Invalid number of Parameters';

    try {
        let dataCheck = helpers.checkReviewDetails(reviewData,doctorID,userID,appointmentID,date,time);
        const newId = ObjectId();
        let newReview = {
            Reviewer_id: userID,
            doctor_id: doctorID,
            appointment_id: newUserComment,
            date: date.toDateString(),
            time: date.getHours()
        }

        const reviewCollection = await reviews();
        let reviews = await reviewCollection.find(
            {"doctor_id":ObjectId(id)}
        );
    
        if(reviews ==  null){
            const updatedReviewData = await reviewCollection.updateOne({_id: ObjectId(newId)},{$set: newReview}); //  need to check this
            if(!updatedReviewData.acknowledged || !updatedReviewData.modifiedCount) throw 'Review could not be added';

            const review = await reviews.getReviewById(newId)
            return review;
        }

    } catch (e) {
        return e;
    }
}

async function getAllUserReviews(id){
    if(!id) throw 'ID is not present to get User Reviews';
    if (!ObjectId.isValid(id)) throw 'Invalid USer ID';
    if(arguments.length!=1) throw 'Invalid number of parameters to retrieve all User Reviews';

    try {
        let idCheck = helpers.checkID(id);
        id = id.trim();

        const reviewCollection = await reviews();
        let reviews = await reviewCollection.find(
            {"Reviewer_id":ObjectId(id)}
        );
    
        if(reviews ==  null) throw 'No Reviews by this User';
        
        return reviews;
    } catch (e) {
        return e;
    }

}

async function getAllDoctorReviews(id){
    if(!id) throw 'ID is not present to get Doctor Reviews';
    if (!ObjectId.isValid(id)) throw 'Invalid Doctor ID';
    if(arguments.length!=1) throw 'Invalid number of parameters to retrieve all Doctor Reviews';

    try {
        let idCheck = helpers.checkID(id);
        id = id.trim();

        const reviewCollection = await reviews();
        let reviews = await reviewCollection.find(
            {"doctor_id":ObjectId(id)}
        );
    
        if(reviews ==  null) throw 'This doctor has not been reviewed yet';
        
        return reviews;
    } catch (e) {
        return e;
    }
}

async function getReviewById(id){
    if(!id) throw 'ID is not present to get Review';
    if (!ObjectId.isValid(id)) throw 'Invalid review ID';
    if(arguments.length!=1) throw 'Invalid number of parameters to retrieve Review';

    try {
        let idCheck = helpers.checkID(id);
        id = id.trim();

        const reviewCollection = await reviews();
        let reviews = await reviewCollection.find(
            {_id:ObjectId(id)}
        );
    
        if(reviews ==  null) throw 'This doctor has not been reviewed yet';
        
        return reviews;
    } catch (e) {
        return e;
    }
}

async function removeReview(id){
    if(!id) throw 'ID is not present to get delete Review';
    if (!ObjectId.isValid(id)) throw 'Invalid review ID';
    if(arguments.length!=1) throw 'Invalid number of parameters to delete Review';

    try {
        let idCheck = helpers.checkID(id);
        id = id.trim();

        const reviewCollection = await reviews();
        let reviews = await reviewCollection.find(
            {_id:ObjectId(id)}
        );
    
        if(reviews ==  null) throw 'No review present to delete';
        
        return reviews;
    } catch (e) {
        return e;
    }
}

// are we doing this?
async function updateReview(){
    
}

module.exports = {
    createReview,
    getAllUserReviews,
    getAllDoctorReviews,
    getReviewById,
    removeReview
    //updateReview
}