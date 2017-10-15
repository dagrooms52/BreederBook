'use strict';

const shortid = require('shortid');
const UserSchema = require('../database/schemas/user');

class UserOrchestrator {

    constructor(dbConnectionUri) {
        this.users = {}
        this.dbConnectionUri = dbConnectionUri;
    }

    getUser(userId) {
        if(!shortid.isValid(userId)) {
            return null;
        }

        var user = this.users[userId.toString()];
        
        if (user){
            return user;
        }

        return null;
    }

    // Returns: User (null if failed)
    createUser(userData) {

        var user = userData;

        // Create ID
        var id = shortid.generate().toString();

        user.id = id

        // Add to dictionary - this will become push to database
        if(this.users[id] != null) {
            // Would overwrite data - this is a server error, non-unique ID
            return null;
        }

        this.users[id] = user;

        return user;
    }
}

module.exports = UserOrchestrator;