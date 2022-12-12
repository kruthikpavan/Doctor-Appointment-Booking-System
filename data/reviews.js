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
        let dataCheck = validator.validString(reviewContent);
        analysedReview = await Analyser(review);
        const newId = ObjectId();
        let date = new Date();
        let newReview = {
            Reviewer_id: userID,
            doctor_id: doctorID,
            appointment_id: appointmentID,
            date: date.toDateString(),
            time: date.getHours(),
            review: reviewContent
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

async function Analyser(reviewData)
{
    try {
        
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
        const analysis = analyzer.getSentiment(filteredReview);

        if (analysis < 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/emoji/96/000000/angry-face.png">';
            title.style.color = 'red';
            outline.style.borderColor = 'red';
            };
            if (analysis === 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
            title.style.color = '#00367c';
            outline.style.borderColor = '#00367c';
            }
            if (analysis > 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
            title.style.color = 'green';
            outline.style.borderColor = 'green'
            }
    
        return  analysis;

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