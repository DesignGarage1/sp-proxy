var express = require('express');
var app = express();
var routers = require('./routers');
var config = require('./config');

// init proxy
var proxy = require('./proxy');
proxy.init();

// middlewares
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(req, res, next) {
  if (config.CURRENT_DOMAIN === undefined) {
    config.CURRENT_DOMAIN = req.headers.host;
  }
  next();
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.json({ error: 'Something broke!' });
});

// process request
app.post('/upload', routers.upload);
app.get('/images/:id/:type/:timestamp.jpg', routers.image);
app.get('/proxy', routers.proxy);

app.listen(process.env.PORT || 3000);

// heroku hack
var request = require('request');
var DELAY_TIME = 6000; // 10 minutes
function request_itself() {
  if (config.CURRENT_DOMAIN != undefined) {
    var url = 'http://' + config.CURRENT_DOMAIN;
    request.get(url);
  }
  setTimeout(request_itself, DELAY_TIME);
}

setTimeout(request_itself, DELAY_TIME);
process.on('uncaughtException', function(err) {
  console.log(err);
});
