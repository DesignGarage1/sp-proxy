var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    request = require('request'),
    config = require('../config'),
    uploadToS3 = require('./uploadToS3');


module.exports = function(req, res, next) {
  var form = new multiparty.Form();
  form.on('part', function(part) {
    if (!part.filename) return;
    uploadToS3(part, function(err, data) {
      if (err) return next(err);
      res.json(data);
    });
  });
  form.on('error', next);
  form.parse(req);
};
