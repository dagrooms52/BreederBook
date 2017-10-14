'use strict';

class Rating {

    // This has to be created from database JSON
    constructor(ratingCount, avgRating) {
        this.count = ratingCount;
        this.avgRating = avgRating;
    }

    addRating(ratingNumber) {
        if(ratingNumber < 1 || ratingNumber > 5) throw RangeError("Rating must be between 1 and 5")

        // Weighted average
        var currentSum = this.avgRating * this.count;
        this.count++;
        currentSum += ratingNumber;
        this.avgRating = currentSum / this.count;
    }
}

module.exports = Rating;