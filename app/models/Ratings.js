var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    //will implement more later
}); 

var Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;