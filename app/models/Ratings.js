var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    barName: String,
    waitTime: String,
    drinks: String,
    washrooms: String,
    music: String
}); 

var Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;