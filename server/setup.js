'use strict';

const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');

// A really bad fake IoC container
class Setup {

    constructor(server) {
        this.orchestrators = []
        this.controllers = []

        this.setupServer(server)
    }

    setupServer(server) {
        this.setupControllers(server)
    }

    setupControllers(server) {
        var orchestrators = this.setupOrchestrators();

        var breederController = new BreederController(server, this.orchestrators['breeder']);

        this.controllers.push(
            {
                key: 'breeder', 
                value: breederController
            })
    }

    setupOrchestrators() {
        var breederOrchestrator = new BreederOrchestrator();

        this.orchestrators.push(
            {
                key: 'breeder', 
                value: breederOrchestrator
            });
    }

}

module.exports = Setup;