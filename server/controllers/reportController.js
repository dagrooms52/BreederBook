'use strict';

const baseRoute = "/reports";

class ReportController {

    constructor(reportOrchestrator) {
        this.reportOrchestrator = reportOrchestrator;
    }

    async getBreederRiskReport(reply) {
        
    }

    setupRoutes(server) {
        var controller = this;

        // GET /reports/risk/breeders
        server.route({
            method: 'GET',
            path: baseRoute + '/risk/breeders',
            handler: function(request, reply){
                var promise = controller.getBreederRiskReport(reply);
                promise.then(
                    function(){
                        console.log("Request completed")
                    }, 
                    function(){
                        console.log("Error occurred")
                        reply().code(500);
                    });
            }
        });
    }
}

module.exports = ReportController;