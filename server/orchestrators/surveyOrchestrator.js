'use strict';
const Survey = require('../schemas/survey/survey');
const shortid = require('shortid');
const SurveySchema = require('../database/schemas/survey');
const Mongoose = require('mongoose');

class SurveyOrchestrator {

    constructor(dbConnectionUri) {
        this.surveys = {};
        this.dbConnectionUri = dbConnectionUri;
    }

    async getSurvey(surveyId) {
        if (!shortid.isValid(surveyId)) { return null; }

        var db = await Mongoose.createConnection(this.dbConnectionUri);

        var SurveyModel = db.model('Survey', SurveySchema);
        return await SurveyModel.findOne({'id': surveyId});
    }

    async getSurveysForBreeder(breederId, reply) {
        var db = await Mongoose.createConnection(this.dbConnectionUri);

        var SurveyModel = db.model('Survey', SurveySchema);
        return await SurveyModel.find({'breederId': breederId});
    }

    // Returns: Survey (null if failed)
    async createSurvey(surveyData) {
        var survey = {
            breederId: surveyData.breederId,
            userId: surveyData.userId,
            questions: surveyData.questions,
            id: shortid.generate().toString()
        };

        var populatedSurvey = this.populateMissingEntries(survey);

        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        
        var SurveyModel = db.model('Survey', SurveySchema);
        var surveyEntry = new SurveyModel(survey);
        var surveyResult = await surveyEntry.save();
        return surveyResult;
    }

    // Returns: survey (null if failed)
    async updateSurvey(surveyId, surveyData) {
        if (!shortid.isValid(surveyId)) { return null };

        var db = await Mongoose.createConnection(this.dbConnectionUri);
        var SurveyModel = db.model('Survey', SurveySchema);
        var result = await SurveyModel.findOneAndUpdate({'id': surveyId}, surveyData, {new: true});

        return result;
    }

    // TODO: Check if ID exists & return false / 404
    async deleteSurvey(surveyId) {
        if (!shortid.isValid(surveyId)) return false;

        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        var SurveyModel = db.model('Survey', SurveySchema);    
        
        var result = await SurveyModel.findOneAndRemove({'id': surveyId});

        return result != null;
    }

    populateMissingEntries(surveyData) {
        var newData = surveyData;

        var questions = [
            "Was the dog less than eight (8) weeks old?",
            "Did you see the parents of the dog?",
            "Did you pick up the dog from the seller's house?",
            "Were all animals kept in clean and safe conditions?",
            "Did you discover any health problems after receiving the dog?"
        ];

        var presentQuestions = [];
        for(var i = 0; i < newData.questions.length; i++){
            presentQuestions.push(newData.questions[i].question)
        }

        for(var i = 0; i < questions.length; i++){
            if(!presentQuestions.includes(questions[i])){
                newData.questions.push({question: questions[i], answer: "did not answer"});
            }
        }
    }

}

module.exports = SurveyOrchestrator;