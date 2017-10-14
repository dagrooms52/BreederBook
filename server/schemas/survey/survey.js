'use strict';

class Survey {

    constructor(internalId, breederId, userId, questions) {
        this.id = internalId;
        this.breederId = breederId;
        this.userId = userId; // TODO: requires SSO
        this.questions = questions;
    }

}

module.exports = Survey;