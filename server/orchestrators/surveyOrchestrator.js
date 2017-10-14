'use strict';
const Survey = require('../schemas/survey/survey')
const shortid = require('shortid');

class SurveyOrchestrator {

    constructor() {
        this.surveys = {};
    }

    getSurvey(surveyId) {
        var isValidId = shortid.isValid(surveyId);

        var survey = this.surveys[surveyId.toString()];
        
        console.log("get survey data");
        console.log(survey);

        if (survey){
            return survey;
        }

        return null;
    }

    // Returns: Survey (null if failed)
    createSurvey(surveyData) {

        var survey = surveyData;

        if(referencedBreeder == null || referencedUser == null) {
            return 
        }

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