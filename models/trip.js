var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
	date: {type: String, required: true, unique: true},
	driver: {type: String, required: true},
    city: {type: String, required: true},
	miles: { type: Number, required: true },
    gallons: { type: Number, required: true }
});

tripSchema.virtual('mpg').get(function(){
    return (this.miles / this.gallons).toFixed(2);
});

module.exports = mongoose.model('Trip', tripSchema);