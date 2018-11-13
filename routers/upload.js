var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    Batch = require('batch'),
    request = require('request'),
    config = require('../config'),
    uploadToS3 = require('./uploadToS3');


module.exports = function(req, res, next) {
  var form = new multiparty.Form(),
      batch = new Batch(),
      friend_id = '',
      code = '';

  batch.push(function(callback) {
    form.on('field', function(name, value) {
      console.log(name + ' ' +  value);
      if (name === 'code') code = value;
      else if (name === 'friend_id') friend_id = value;
      callback(null, value);
    });
  });

  batch.push(function(callback) {
    form.on('part', function(part) {
      if (!part.filename) return;
      callback(null, part);
    });
  });

  batch.end(function(err, results) {
    if (err) return next(err);
    uploadToS3(results[1], function(err, data) {
      if (err) return next(err);
      var url = 'http://' + config.SIMPLEPRINTS_DOMAIN + '/labs/code/' + code + '/images/';
      request.post({
        url: url,
        formData: {
          'original_url': data.url,
          'friend_id': friend_id,
        }
      }, function(err, response, body) {
        res.json(JSON.parse(body));
      });
    });
  });

  form.on('error', next);
  form.parse(req);
};
