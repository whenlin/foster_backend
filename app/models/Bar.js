var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BarSchema = new Schema({
    barName: String,
    province: String,
    city: String,
    address: String
}); 

var Bar = mongoose.model('Bar', BarSchema);
module.exports = Bar;