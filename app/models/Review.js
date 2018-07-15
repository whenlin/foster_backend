var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    barName: String,
    barRating: String,
    message: String
}); 

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;