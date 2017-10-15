'use strict';

class ReportOrchestrator {
    
    constructor(breederOrchestrator, surveyOrchestrator) {
        this.breederOrchestrator = breederOrchestrator;
        this.surveyOrchestrator = surveyOrchestrator;
    }

    async getBreederRiskReport() {
        // Get all breeders
        var breeders = await this.breederOrchestrator.searchBreeders();

        // For each breeders
    }

    score_survey(survey) {

    }
}