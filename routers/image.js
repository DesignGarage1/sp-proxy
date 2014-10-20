var request = require('request'),
    config = require('../config'),
    proxy = require('../proxy');


module.exports = function(req, res) {
  var s3Key = req.url.substr(7);
  var imageUrl = 'http://s3.amazonaws.com/' + config.AWS_BUCKET + s3Key;

  var path = '/unsafe/' + imageUrl;
  if (req.query.w != undefined &&
      req.query.h != undefined &&
      parseInt(req.query.w) != NaN &&
      parseInt(req.query.h) != NaN) {
    path = '/unsafe/' + req.query.w + 'x' + req.query.h + '/' + imageUrl;
  }

  var target = proxy.getProxy();
  var url = target.domain + path;
  target.processing += 1;

  console.log('proxy\n  ' + imageUrl + '\n  ==> ' + url);

  request
    .get(target.domain + path)
    .on('response', function(response) {
      target.processed += 1;
      target.processing -= 1;
    })
    .pipe(res);
}
