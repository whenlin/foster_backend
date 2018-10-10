var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors=require('cors');

var port = 8080;

    // DATABASE SETUP
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/barapp'); // connect to our database
    
    // Handle the connection event
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    
    db.once('open', function() {
      console.log("DB connection alive");
    });

    app.use(function(request, response, next)
    {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
        next();
    });
    
    // uncomment the following line for the production version
    //app.use(express.static('public'));
    // the following 2 middleware convert the URL req and res to json format
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(cors());
    
//    var router = express.Router();
    
//router.use(function(req, res, next) {
	// do logging
//	console.log('Something is happening.');
//	next();
//});

    var Bar = require('./app/models/Bar');
    var Review = require('./app/models/Review');
    var Rating = require('./app/models/Ratings');
    
    app.post('/addBar', function(req,res,next){         //adds a bar to the bar database
      //  console.log(req.body);
        
        var data = new Bar();
        data.barName = req.body.barName;
        data.province = req.body.province;
        data.city = req.body.city;
        data.address = req.body.address;
        
        data.save(function(err){
            if (err) 
            {
                res.send(err);
            }else{
                res.json({message: 'Bar successfully entered!'});
                console.log('SUCCESS!');
            }
        });
    })
    
    .post('/addLondonBar', function(req, res, next){
        var data = new Bar();
        data.barName = req.body.barName;
        
        data.save(function(err){
            if (err) 
            {
                res.send(err);
            }else{
                res.json({message: data});
                console.log('Bar saved successfully!');
            }
        });
    })
    
    .post('/addReview', function(req, res, next){   //posts a bar rating and review to the database
        
        console.log(req.body);
        
        var data = new Review();
        data.barName = req.body.barName;
        data.personName= req.body.personName;
        data.message = req.body.message;
        data.school =  req.body.institution;
        
        data.save(function(err){
           if(err) throw err;
           else{
               console.log({Review: data});
               res.send("SUCCESS!!!!");
           }
        });
        
        
    });

    app.get('/bars', function(req, res, next){              //gets all bars in database
    console.log("All bar info is being requested...");
    
       Bar.find(function(err, Bars){
           if(err){ 
               console.log(err);
               throw err;
           }                                                    //CURRENTLY RETURNS THE BAR NAMES ONLY
           else{
               
               var array = [];
               
               for(i in Bars){
                   array.push(Bars[i].barName);
               }
               
            array.sort(); //sorts the array alphabetically
               
            res.json({bars: array});
           
           }
       }); 
    })
    
    .put('/bars/:Bar_id',function(req, res, next){ //updates the specified bar's info , THE CODE IN THIS ROUTE CURRENTLY UPDATES THE BARS NAME
        Bar.findById(req.params.Bar_id, function(err, Bar) {

			if (err)
				console.log(err);

			Bar.barName = req.body.name;
			
			Bar.save(function(err) {
				if (err)
					console.log(err);

				res.json({ message: 'Bar info updated!' });
			});

		});
    })
    
    .get('/londonBars', function(req, res, next){ //gets bars in london, ontario
         console.log("All bar info is being requested...");
    
       Bar.find(function(err, Bars){
           if(err){ 
               console.log(err);
               throw err;
           }
           else{
               
            res.json({bars: Bars});
           
           }
       }); 
           
    })

    .get('/bars/:barName',function(req,res,next){   //gets specified bar
        
        Bar.find({ barName: req.params.barName }, function(err, Bar){
            if(err){ 
                res.send(err);
                throw err;
            }
            else
                res.json(Bar);
            
        });
    })
    
    .delete('/bars/:barName', function(req,res,next){ //deletes specified bar
        Bar.remove({
			barName: req.params.barName
		}, function(err, bar) {
			if (err)
				console.log(err);

			res.json({ deleted: bar });
		});
    })
    
    .post('/ratings', function(req, res, next){
        
        var data =  new Rating();                   //saves ratings for the bars to the database
        data.barName = req.body.barName;
        data.waitTime = req.body.waitTime;
        data.drinks = req.body.drinks;
        data.washrooms = req.body.washrooms;
        data.music = req.body.music;
        
        data.save(function(err){
          if(err) {
              console.log(err);
              throw err;
          }
          else{
              console.log("Ratings for " + data.barName + " were successfully added!");
              res.json({Ratings: data});
          }
        });
    })
    
    .get('/ratings/:barName', function(req, res, next){
        Rating.find({ barName: req.params.barName }, function(err, Ratings){
            console.log("Ratings requested");
            if(err){
                console.log(err);
                throw err;
            } else {
                var waitSum = 0.0; var drinksSum = 0.0; var washroomsSum = 0.0; var musicSum = 0.0; 
                var waitAvg = 0.0; var drinkAvg = 0.0; var washroomsAvg = 0.0; var musicAvg = 0.0; var overallAvg = 0.0;
                
              //  console.log(Ratings);
                for(i in Ratings){
                    
                    waitSum += parseInt(Ratings[i].waitTime);
                    drinksSum += parseInt(Ratings[i].drinks);
                    washroomsSum += parseInt(Ratings[i].washrooms);
                    musicSum += parseInt(Ratings[i].music);
                }
                
                var length = 0.0;
                 length = Ratings.length;
               
                
                waitAvg = waitSum / length;
                drinkAvg = drinksSum / length;
                washroomsAvg = washroomsSum / length;
                musicAvg = musicSum / length;
                
                overallAvg = (waitAvg + drinkAvg + washroomsAvg + musicAvg) / 4.0;
                overallAvg = Math.round(overallAvg * 10) / 10;
                
                var overall = overallAvg.toString();
                var wait = waitAvg.toString();
                var drink = drinkAvg.toString();
                var washrooms = washroomsAvg.toString();
                var music = musicAvg.toString();
                
                var ratings_json = {
                    "overallAvg": overall,
                    "waitAvg": wait,
                    "drinkAvg": drink,
                    "washroomsAvg": washrooms,
                    "musicAvg": music
                };
                
                var array = [ratings_json]; //array containing json data
                
                res.json({ratings: array});
                
            }
        });
    })
    
    .get('/reviews', function(req, res, next){      //gets all reviews 
        Review.find(function(err, Reviews){
           if(err) throw err;
           
           res.json(Reviews);
       }); 
    })
    
    .get('/reviews/:barName', function(req, res, next){     //gets 3 reviews for the specified bar
         Review.find({ barName: req.params.barName }, function(err, Review){
             console.log("reviews..");
            if(err){ 
                res.send(err);
                throw err;
            } else if (Review.length == 0){
                
            }
            else
                res.json({reviews: Review});
            
        }).limit(3);
    })
    
    .get('/allReviews/:barName', function(req, res, next){ //gets ALL reviews for the specified bar
        Review.find({ barName: req.params.barName }, function(err, Review){
            if(err){ 
                res.send(err);
                throw err;
            }
            else
                res.json({reviews: Review});
            
        });
    })
    
    .delete('/reviews', function(req, res, next){
        Review.remove(function (err, Review) {
            if(err){ 
                console.log(err);
                throw err;
            }
            else
                res.json({Deleted: Review});
        });
    })
    
    .delete('/ratings/:barName', function(req, res, next){
        Rating.remove({ barName: req.params.barName }, function(err, Rating){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                res.json({ Deleted: Rating });
            }
        });
    })
    
    .delete('/allReviews/:_id', function(req, res, next){
        Review.remove({ _id: req.params._id }, function(err, Review){
            if(err){
                console.log(err);
            }else{
                res.json({Deleted: Review});
            }
        });
    });

app.listen(port, function() 
{
    console.log('The server is listening on port ' + port);
});