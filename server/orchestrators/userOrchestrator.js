'use strict';

const UserSchema = require('../database/schemas/user');
const Mongoose = require('mongoose');

class UserOrchestrator {

    constructor(dbPromise) {
        this.users = {}
        this.dbPromise = dbPromise;
    }

    async getUser(userId) {
        var db = await this.dbPromise
        
        var UserModel = db.model('User', UserSchema);
        return await UserModel.findById(userId);
    }

    // Returns: User (null if failed)
    async createUser(userData) {

        var user = userData;

        var db = await this.dbPromise;
        
        var UserModel = db.model('User', UserSchema);
        var userEntry = new UserModel(user);
        var userResult = await userEntry.save();

        return userResult;
    }
}

module.exports = UserOrchestrator;