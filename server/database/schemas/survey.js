'use strict';

const Schema = require('mongoose').Schema;

const SurveySchema = new Schema({
    breederId: { type: Schema.Types.ObjectId, ref: 'Breeder' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
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
    }],
    rating: { type: Number, min: 1, max: 5},
    comment : String
});

module.exports = SurveySchema;