'use strict';
const Survey = require('../schemas/survey/survey')
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

    // Returns: Survey (null if failed)
    async createSurvey(surveyData) {

        var survey = surveyData;

        // Create ID
        var id = shortid.generate().toString();
        survey.id = id

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
        var result = await SurveyModel.findOneAndUpdate({'id': surveyId}, surveyData);

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

}

module.exports = SurveyOrchestrator;