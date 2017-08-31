var express = require('express'),
    http = require('http'),
    redis = require('redis');

var app = express();
 
var client = redis.createClient('6379', 'redis');


app.get('/', function(req, res, next) {
  console.log(`Receiving request from: ${process.env.CONTAINER} `);
  client.incr('counter', function(err, counter) {
    if(err) return next(err);
    res.send(`Container: ${process.env.CONTAINER} - This page has been viewed ${ counter }  times!`);
  });
});

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});