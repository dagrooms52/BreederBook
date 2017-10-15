'use strict';

class ReportOrchestrator {
    
    constructor(breederOrchestrator, surveyOrchestrator) {
        this.breederOrchestrator = breederOrchestrator;
        this.surveyOrchestrator = surveyOrchestrator;
    }

    async getBreederRiskReport() {
        // Get all breeders
        console.log("Getting breeders")
        var breeders = await this.breederOrchestrator.searchBreeders();

        var breedersToScores = [];

        // For each breeder
        for(var i = 0; i < breeders.length; i++) {
            var riskScore = 0;

            // Get all surveys
            var surveys = await this.surveyOrchestrator.getSurveysForBreeder(breeders[i]._id);

            // For each survey
            if (surveys.length > 0) {

                for(var j = 0; j < surveys.length; j++) {
                    // Get survey risk score
                    var surveyScore = this.scoreSurvey(surveys[j]);

                    // Contribute to average risk
                    riskScore += surveyScore;
                }

                var avgRisk = 10 - (riskScore / surveys.length);
                
                breedersToScores.push({breederId: breeders[i]._id, risk: avgRisk});

            }
        }

        return breedersToScores;
    }

    scoreSurvey(survey) {
        // Weight on scale of 0 to 10 by number answered
        // 5 being neutral
        var score = 5;

        for (var k = 0; k < survey.questions.length; k++) {
            var scalar = 0;
            if (survey.questions[k].answer == "yes") {
                scalar = 1
            }
            else if (survey.questions[k].answer == "no") {
                scalar = -1
            }
            var scoreWeight = scalar * this.getMultiplier(survey.questions[k].question);
 
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