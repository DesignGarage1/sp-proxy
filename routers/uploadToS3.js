var uuid = require('node-uuid'),
    S3 = require('aws-sdk/clients/s3');
    config = require('../config');

var uploadToS3 = function(fileStream, next) {
  var id = uuid.v4();
  var timestamp = Date.now();
  var s3Key = id + '-' + timestamp + '.jpg';
  var s3Client = new S3();

  var params = {
    Key: s3Key,
    Bucket: config.AWS_BUCKET,
    Body: fileStream,
    ACL: 'public-read',
    ContentLength: fileStream.byteCount,
    ContentType: 'image/jpeg',
  };

  console.log('Upload to S3: ' + s3Key);
  s3Client.upload(params, function(err, data) {
    if (err) return next(err);
    next(null, {
      key: data.Key,
      url: data.Location,
    });
  });
}

module.exports = uploadToS3;
