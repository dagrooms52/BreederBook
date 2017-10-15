'use strict';

const Schema = require('mongoose').Schema;

const SurveySchema = new Schema({
    id: {type: String, index: true},
    breederId: String,
    userId: String,
    questions:[{
        question: {
            type: String,
            enum: [
                "Was the dog less than eight (8) weeks old?",
                "Did you see the parents of the dog?",
                "Did you pick up the dog from the seller's house?",
                "Were all animals kept in clean and safe conditions?",
                "Did you discover any health problems after receiving the dog?"
            ]
        },
        answer: { 
            type: String,
            enum: [
                "yes",
                "no",
                "did not answer"
            ],
            default: "did not answer"
        }
    }]
});

module.exports = SurveySchema;