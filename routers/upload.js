var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    knox = require('knox'),
    Batch = require('batch'),
    config = require('../config');


function uploadToS3(fileStream, next) {
  var s3Client = knox.createClient({
        secure: false,
        key: config.AWS_KEY,
        secret: config.AWS_SECRET,
        bucket: config.AWS_BUCKET,
      });
  var id = uuid.v4();
  var timestamp = Date.now();
  var s3Key = id + '/original/' + timestamp + '.jpg';
  var headers = {
    'Content-Length': fileStream.byteCount,
    'x-amz-acl': 'public-read',
    'Content-Type': 'image/jpeg'
  };

  console.log("Upload to S3 " + s3Key);
  s3Client.putStream(fileStream, s3Key, headers, function(err, s3Response) {
    if (err) return next(err);
    next(null, {
      id: id,
      timestamp: timestamp,
      url: config.DOMAIN + '/images/' + s3Key
    });
  });
}


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
      try { res.json(data); } catch(e) {}
    })
  });

  form.on('error', next);
  form.parse(req);
};
