const aposToLexForm = require('apos-to-lex-form');
const express = require('express');
const SpellCorrector = require('spelling-corrector');
const natural = require('natural');
const SW = require('stopword');


const router = express.Router();

router.post('/s-analyzer', function(req, res, next) {
    const { review } = req.body;
    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    //using tokenizer from natural
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer;
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    tokenizedReview.forEach((word,index) => {
        tokenizedReview[index] = SpellCorrector.correct(word);
    })
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);

    res.status(200).json({ analysis });

});

module.exports = router;
