const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');
const helpers = require("../helpers");
const validator = require('../validation');

const aposToLexForm = require('apos-to-lex-form');
const express = require('express');
const SpellCorrector = require('spelling-corrector');
const natural = require('natural');
const SW = require('stopword');

async function createReview(reviewContent,doctorID,userID,appointmentID){
    if(!reviewContent || !doctorID || !userID || !appointmentID) throw 'All fields are mandatory for post review';
    if (!ObjectId.isValid(doctorID)) throw 'Invalid Doctor ID';
    if (!ObjectId.isValid(userID)) throw 'Invalid User ID';
    if (!ObjectId.isValid(appointmentID)) throw 'Invalid Appointment ID';
    if(arguments.length != 4) throw 'Invalid number of Parameters';

    try {
        const reviewCollection = await reviews();
        let dataCheck = validator.validString(reviewContent);
        reviewContent = reviewContent;
        analysedReview = await Analyser(reviewContent);
        const newId = ObjectId();
        let date = new Date();
        let newReview = {
            Reviewer_id: userID,
            doctor_id: doctorID,
            appointment_id: appointmentID,
            date: date.toDateString(),
            time: date.getHours(),
            review: reviewContent,
            score: analysedReview['analysis']
        }

        // let reviews = await reviewCollection.find(
        //     {"doctor_id":ObjectId(id)}
        // );
            const insertedReview = await reviewCollection.insertOne(newReview); //  need to check this
            if(!insertedReview.acknowledged || !insertedReview.insertedId) throw 'Review could not be added';

            const review = await getReviewById(insertedReview.insertedId)
            review['imgSource'] = analysedReview['imgSource'] ;
            review['color'] =analysedReview['color'] ;
            review['acknowledged'] =true ;

            return review;
        

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
        let idCheck = validator.validId(id);
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
        let idCheck = validator.validId(id);
        const reviewCollection = await reviews();
        let reviewData = await reviewCollection.findOne(
            {_id:ObjectId(id)}
        );
    
        if(reviewData ==  null) throw 'This doctor has not been reviewed yet';
        
        return reviewData;
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
    
    const updatedReviewData = await reviewCollection.updateOne({_id: ObjectId(newId)},{$set: newReview}); //  need to check this
    if(!updatedReviewData.acknowledged || !updatedReviewData.modifiedCount) throw 'Review could not be added';
}

async function Analyser(reviewData)
{
    try {
        let final_Review = [];
        
        let  review  = reviewData;
        const lexedReview = aposToLexForm(review);
        const casedReview = lexedReview.toLowerCase();
        const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    
        //using tokenizer from natural
        const { WordTokenizer } = natural;
        const tokenizer = new WordTokenizer;
        const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

        
        // tokenizedReview.forEach((word,index) => {
        //     tokenizedReview[index] = SpellCorrector.correct(word);
        // })
        const filteredReview = SW.removeStopwords(tokenizedReview);
    
        const { SentimentAnalyzer, PorterStemmer } = natural;
        const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
        final_Review['analysis']  = analyzer.getSentiment(filteredReview);

        if (final_Review['analysis'] < 0) {
            final_Review['imgSource'] = '<img src="https://img.icons8.com/emoji/96/000000/angry-face.png">';
            final_Review['color'] = 'red';
            };
            if (final_Review['analysis'] === 0) {
            final_Review['imgSource'] = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
            final_Review['color'] = '#00367c';
            
            }
            if (final_Review['analysis'] > 0) {
                final_Review['imgSource'] = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
                final_Review['color'] = 'green';
            }
    
        return  final_Review;

    } catch (e) {
        return e;
    }
}

module.exports = {
    createReview,
    getAllUserReviews,
    getAllDoctorReviews,
    getReviewById,
    removeReview,
    Analyser
    //updateReview
}