var uuid = require('node-uuid'),
    knox = require('knox'),
    config = require('../config');


var uploadToS3 = function(fileStream, next) {
  var s3Client = knox.createClient({
        secure: false,
        key: config.AWS_KEY,
        secret: config.AWS_SECRET,
        bucket: config.AWS_BUCKET,
      });
  var id = uuid.v4();
  var timestamp = Date.now();
  var s3Key = id + '.jpg';
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

module.exports = uploadToS3;