const express = require('express');
const app = express();
const config = require('./src/config');
const expressPort = config.port;

nunjucks = require('nunjucks')
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Set html for templates
app.set('view engine', 'html'); 
// express settings
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


// Import mongoose schema
let Trip = require('./models/trip');

let connectDB = require('./modules/db');
connectDB();

// Routes

//Home
app.get('/', (req, res) => {   
    Trip.find( (err, allTrips) => {   
		if (err) {
		    res.render('resultpage', {result : err});   
		}
		else {
		    if (allTrips.length == 0) {  
			   res.render('resultpage', {result : 'No Trips Posted Yet.'});   
		    }
		    else {
			   	res.render('home', { trips: allTrips });
		    }
		}
	});
});

// Show All
app.get('/showAll', (req, res) => { 	  
	Trip.find( (err, allTrips) => {   
		if (err) {
		    res.render('resultpage', {result : err});   
		}
		else {
		    if (allTrips.length == 0) {  
			   res.render('resultpage', {result : 'No Trips Posted Yet.'});   
		    }
		    else {
			   	res.render('home', { trips: allTrips });
		    }
		}
	});
    
});

// Add Trip
app.use('/addTrip', (req, res) => {  
  
	if(req.method == "GET") {
		res.render('addTripForm', {title: 'add trip'});
	}
	else if(req.method == "POST") {
	    var newTrip = new Trip({        
	        driver: req.body.driver,
	        date: req.body.date,
            city: req.body.city,
	        miles: req.body.miles,
            gallons: req.body.gallons
	    });

	    newTrip.save((err) => {     
		    if (err) {
		    	res.render('resultpage', {result : 'Error ' + err});  
		    }
		    else {
		        res.render('resultpage', {title: 'add trip', result : 'new trip added'});   
		    }
	    }); 
	}
});

// Get all trips for selected city
app.use('/getByCity', (req, res) => {   
    if(req.method == "GET") {
		res.render('getCityForm', {title: 'trips by city'}); // send form
	}
	else if(req.method == "POST") {
		
		var reqCity = req.body.city;  // read the city
		
		Trip.find( {city: reqCity}, (err, allByCity) => {  
			if (err) {
				res.render('resultpage', {result : err});   
			}
			else {
				if (allByCity.length == 0) { 
					res.render('resultpage', {result : 'No trips in this city'});   
				}
				else {
					res.render('showAll', { trips: allByCity });  
				}
			}
		});
	} 
});

// Display Info for Trip
app.use('/displayTripInfo', (req, res) => { 
	if(req.method == 'GET') {
		res.render('getTripForm', {title: 'Trips'});
	}
	else { 
					
		var date = req.body.date;
	
		Trip.findOne( {date: date}, (err, aTrip) => {
		
			if (err) {
				res.render('resultpage', {result : err});   
			}
			else if (!aTrip) {
				res.render('resultpage', {result : `No trip on date ${date}`});   
			}
			else {		
			res.render('editTripInfo', {tripData: aTrip});
			}
	   });    
	
	}
});

app.post('/updateTripInfo', (req, res) => { 
	
	var date = req.body.date;
	Trip.findOne( {date: date}, (err, aTrip) => {  
		if (err) {
			res.render('resultpage', {result : err});   
		}
		else if (!aTrip) {
				res.render('resultpage', {result : 'No trip with that date'});   
		}
		else {   
			if(req.body.newDriver) aTrip.driver = req.body.newDriver; 
			if(req.body.newMiles) aTrip.miles = req.body.newMiles;
			if(req.body.newGallons) aTrip.gallons = req.body.newGallons;
			
			aTrip.save((err) => { 
				if(err) {
					res.render('resultpage', {result : err});   
				}
			});
			var msg = `trip data updated for trip ${date}`;
			res.render('resultPage', { result : msg });
	   }
	});    
});

app.get('/deleteTrip', (req, res) => { 
	
    var date = req.query.date; 
 
    Trip.findOneAndRemove({date: date}, (err, aTrip) => {  
        if (err) {
            res.render('resultpage', {result : err});
        }
        else if (!aTrip) {
            res.render('resultpage', {result : 'No trip with that date'});
            
        }
        else {
            var msg = `Trip with date ${date} has been deleted`;
            res.render('resultPage', { result : msg });
        }
    }); 
});


// Set listener on port
app.listen(expressPort, () => {
	console.log(`Listening on port ${expressPort}, ctrl-c to quit`);
    });