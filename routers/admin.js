var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    knox = require('knox'),
    Batch = require('batch'),
    request = require('request'),
    config = require('../config'),
    uploadToS3 = require('./uploadToS3');


module.exports = function(req, res, next) {
  var form = new multiparty.Form(),
      batch = new Batch();

  batch.push(function(cb) {
    form.on('part', function(part) {
      if (! part.filename) return;
      cb(null, part);
    });
  });

  batch.end(function(err, results) {
    if (err) return next(err);
    uploadToS3(results[0], function(err, data) {
      if (err) return next(err);
      res.json(data);
    });
  });

  form.on('error', next);
  form.parse(req);
};
