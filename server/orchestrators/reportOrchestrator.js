'use strict';

class ReportOrchestrator {
    
    constructor(breederOrchestrator, surveyOrchestrator) {
        this.breederOrchestrator = breederOrchestrator;
        this.surveyOrchestrator = surveyOrchestrator;
    }

    async getBreederRiskReport() {
        // Get all breeders
        var breeders = await this.breederOrchestrator.searchBreeders();

        var breedersToScores = {};

        // For each breeder
        for(var i = 0; i < breeders.length; i++) {
            var riskScore = 0;

            // Get all surveys
            var surveys = await this.surveyOrchestrator.getSurveysForBreeder(breeders[i]._id);

            // For each survey
            for(var i = 0; i < surveys.length; i++) {
                // Get survey risk score
                var surveyScore = this.scoreSurvey(surveys[i]);

                // Contribute to average risk
                riskScore += surveyScore;
            }

            var avgRisk = riskScore / surveys.length;
            
            breedersToScores[breeders[i].breederId] = avgRisk;
        }

        return breedersToScores;
    }

    scoreSurvey(survey) {
        // Weight on scale of 0 to 10 by number answered
        // 5 being neutral
        var score = 5;

        for (var i = 0; i < survey.questions.length; i++) {
            var scalar = 0;
            if (survey.questions[i].answer == "yes") {
                scalar = 1
            }
            else if (survey.questions[i].answer == "no") {
                scalar = -1
            }
            var scoreWeight = scalar * this.getMultiplier(survey.questions[i].question);
 
            score += scoreWeight;
        }

        return score;
    }

    getMultiplier(questionString) {
        
        // 1 if yes is good. -1 if yes is bad.
        var multipliers = {
            "Was the dog less than eight (8) weeks old?" : -1,
            "Did you see the parents of the dog?" : 1,
            "Did you pick up the dog from the seller's house?" : 1,
            "Were all animals kept in clean and safe conditions?" : 1,
            "Did you discover any health problems after receiving the dog?" : -1
        }

        return multipliers[questionString];
    }

}

module.exports = ReportOrchestrator;