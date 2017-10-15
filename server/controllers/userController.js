'use strict';

const baseRoute = "/users";

// Just scaffolding, remove when we get SSO
class UserController {

    constructor(userOrchestrator) {
        this.userOrchestrator = userOrchestrator;
    }

    async getUser(userId, reply) {
        var userResult = await this.userOrchestrator.getUser(userId);

        if(userResult == null){
            reply("Not found").code(404);
        }
        else {
            reply(userResult);
        }
    }
    
    async createUser(userJson, reply) {
        
        var userData = userJson;
        
        var resultUser = await this.userOrchestrator.createUser(userData);

        if(resultUser == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(resultUser);
    }

    setupRoutes(server) {
        var controller = this;

        // GET /users/{userId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{userId}',
            handler: function(request, reply){
                var userId = encodeURIComponent(request.params.userId);
                var promise = controller.getUser(userId, reply);
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

        // POST /users
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply){
                var userJson = request.payload;
                var promise = controller.createUser(userJson, reply)
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

module.exports = UserController;