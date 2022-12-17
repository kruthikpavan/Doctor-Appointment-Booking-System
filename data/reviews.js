const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');
const helpers = require("../helpers");
const validator = require('../validation');
const doctors= mongoCollections.doctors
const spell = require('spell-checker-js')



const aposToLexForm = require('apos-to-lex-form');
const express = require('express');
const SpellCorrector = require('spelling-corrector');
const natural = require('natural');
const SW = require('stopword');

async function createReview(reviewContent,doctorID){
    if(!reviewContent || !doctorID) throw 'All fields are mandatory for post review';
    // if (!ObjectId.isValid(userID)) throw 'Invalid User ID';
    // if (!ObjectId.isValid(appointmentID)) throw 'Invalid Appointment ID';
    if(arguments.length != 2) throw 'Invalid number of Parameters';

    try {
        const reviewCollection = await reviews();
        const doctorCollection = await doctors();

        const doctorData= await doctorCollection.findOne({name:doctorID}) 

        let dataCheck = validator.validString(reviewContent);
        const insertedReview = undefined;
        reviewContent = reviewContent;
        analysedReview = await Analyser(reviewContent);
        const newId = ObjectId();
        let date = new Date();
        let reviewsArray = doctorData['reviews'];
        let newReview = {

            doctor_id: doctorData['email'],
            date: date.toDateString(),
            time: date.getHours(),
            review: reviewContent,
            score: analysedReview['analysis'],
            image: analysedReview['imgSource']
        }
        reviewsArray.push(newReview);

        insertedReview= await doctorCollection.updateOne({'name':doctorID}, {"$set": {"reviews": reviewsArray}})

            const insertedReviewtoDB = await reviewCollection.insertOne(newReview); //  need to check this
            if(!insertedReview.insertedId) throw 'Review could not be added';

            //const review = await getReviewById(insertedReview.insertedId)
            newReview['imgSource'] = analysedReview['imgSource'] ;
            newReview['color'] =analysedReview['color'] ;
            newReview['acknowledged'] =true ;

            return newReview;
    
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
        const doctorCollection = await doctors();
        let reviewData = await doctorCollection.findOne(
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
        let alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

        spell.load('en')
        const check = spell.check(alphaOnlyReview);

        alphaOnlyReview  = removeFromString(check, alphaOnlyReview)


        // if(check.length!=0)
        // {
        //     for( let i in check){
        //         if(alphaOnlyReview.includes(check[i]))
        //         {
        //             alphaOnlyReview = alphaOnlyReview.replace(check[i],'')
        //         }
        //     }
        // }
    
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
            final_Review['imgSource'] = '😒';
            final_Review['color'] = 'red';
            };
            if (final_Review['analysis'] === 0) {
            final_Review['imgSource'] = 'https://img.icons8.com/officel/80/000000/neutral-emoticon.png';
            final_Review['color'] = '#00367c';
            
            }
            if (final_Review['analysis'] > 0) {
                final_Review['imgSource'] = 'https://img.icons8.com/color/96/000000/happy.png';
                final_Review['color'] = 'green';
            }
    
        return  final_Review;

    } catch (e) {
        return e;
    }
}

function removeFromString(words, str) {
    return words.reduce((result, word) => result.replace(word, ''), str)
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