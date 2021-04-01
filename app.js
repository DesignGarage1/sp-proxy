var express = require('express');
var app = express(),
    routers = require('./routers'),
    config = require('./config');

// middlewares
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, SP-Environment');
  next();
});

app.use(function(err, req, res, next) {
  let message = 'Something broke!';
  console.error(message);
  console.error(err.stack);
  res.status(500).json({ error: message });
});

// process request
app.post('/upload', routers.upload);

console.info(`Listening on ${config.PORT}`);
app.listen(config.PORT);

// Exception fallback
process.on('uncaughtException', (error) => {
  console.error(error);
  console.error(error.stack);
});
