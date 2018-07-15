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
    
    app.post('/addBar', function(req,res,next){         //adds a bar to the bar database
        console.log(req.body);
        
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
        data.barRating = req.body.rating;
        data.message = req.body.review;
        
        data.save(function(err){
           if(err) throw err;
           else{
               res.json({Review: data});
               console.log('SUCCESS!');
           }
        });
        
        
    });

    app.get('/bars', function(req, res, next){      //gets all bars in database
    console.log("All bar info is being requested...");
    
       Bar.find(function(err, Bars){
           if(err){ 
               console.log(err);
               throw err;
           }
           else{
               
               var array = [];
               
               for(i in Bars){
                 //  console.log(i + Bars[i].barName);
                   array.push(Bars[i].barName);
               }
               
            res.json({bars: array});
           
           }
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
        
    })
    
    .get('/reviews', function(req, res, next){      //gets all reviews 
        Review.find(function(err, Reviews){
           if(err) throw err;
           
           res.json(Reviews);
       }); 
    })
    
    .get('/reviews/:barName', function(req, res, next){     //gets all reviews for the specified bar
         Review.find({ barName: req.params.barName }, function(err, Review){
            if(err){ 
                res.send(err);
                throw err;
            }
            else
                res.json(Review);
            
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
    });
    
function calculateAvgRating(array){
    var sum = 0.0;
    for(i in array){
        sum = sum + array[i];
    }
    var num = array.length;
    
    return sum/num;
}

app.listen(port, function() 
{
    console.log('The server is listening on port ' + port);
});