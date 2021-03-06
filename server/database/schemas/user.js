'use strict';

const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    email: String,
    name: {
        first: String,
        middle: String,
        last: String
    }
});

module.exports = UserSchema;