'use strict';

const baseRoute = "/users";
const shortid = require('shortid');

// Just scaffolding, remove when we get SSO
class UserController {

    constructor(userOrchestrator) {
        this.userOrchestrator = userOrchestrator;
    }

    getUser(userId, reply) {
        var userResult = this.userOrchestrator.getUser(userId);

        if(userResult == null){
            reply("Not found").code(404);
        }
        else {
            reply(JSON.stringify(userResult));
        }
    }
    
    createUser(userJson, reply) {
        
        var userData = JSON.parse(userJson);
        
        var resultUser = this.userOrchestrator.createUser(userData);

        if(resultUser == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(JSON.stringify(resultUser));
    }

    setupRoutes(server) {
        var controller = this;

        // GET /users/{userId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{userId}',
            handler: function(request, reply){
                var userId = encodeURIComponent(request.params.userId);
                controller.getUser(userId, reply);
            }
        });

        // POST /users
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply){
                var userJson = request.payload;
                controller.createUser(userJson, reply)
            }
        });

    }

}

module.exports = UserController;