'use strict';
const Survey = require('../schemas/survey/survey')
const shortid = require('shortid');
const SurveySchema = require('../database/schemas/survey');

class SurveyOrchestrator {

    constructor(dbConnectionUri) {
        this.surveys = {};
        this.dbConnectionUri = dbConnectionUri;
    }

    getSurvey(surveyId) {
        var isValidId = shortid.isValid(surveyId);

        var survey = this.surveys[surveyId.toString()];
        
        if (survey){
            return survey;
        }

        return null;
    }

    // Returns: Survey (null if failed)
    createSurvey(surveyData) {

        var survey = surveyData;

        // Create ID
        var id = shortid.generate().toString();

        survey.id = id

        // Add to dictionary - this will become push to database
        if(this.surveys[id] != null) {
            // Would overwrite data - this is a server error, non-unique ID
            return null;
        }

        this.surveys[id] = survey;

        return survey;
    }

    // Returns: bool (success)
    updateSurvey(surveyId, surveyData) {
        
        // This is checked in the controller but enforced here
        surveyData.id = surveyId;

        if(this.surveys[surveyId] == null) {
            return false;
        }

        this.surveys[surveyId] = surveyData;
        return true;
    }

    // TODO: Check if ID exists & return false / 404
    deleteSurvey(surveyId) {
        delete this.surveys[surveyId]
    }

}

module.exports = SurveyOrchestrator;