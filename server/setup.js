'use strict';

const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');

// A really bad fake IoC container
class Setup {

    constructor(server) {
        setupServer(server)
        this.orchestrators = {}
        this.controllers = {}
    }

    static setupServer(server) {
        setupControllers(server)
    }

    static setupControllers(server) {
        var orchestrators = setupOrchestrators();

        var breederController = new BreederController(server, this.orchestrators['breeder']);

        this.controllers.push('breeder', breederController)
    }

    static setupOrchestrators() {
        var breederOrchestrator = new BreederOrchestrator();

        this.orchestrators.push('breeder', breederOrchestrator);
    }

}

module.exports = Setup;