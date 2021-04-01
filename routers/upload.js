var path = require('path'),
    uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    mime = require('mime-types'),
    S3 = require('aws-sdk/clients/s3'),
    config = require('../config');

function uploadToS3(part, bucket, next) {
  let filename = part.filename;
  let key = `${uuid.v4()}-${Date.now()}${path.extname(filename)}`;
  let params = {
    Key: key,
    Bucket: bucket,
    Body: part,
    ACL: 'public-read',
    ContentLength: part.byteCount,
    ContentType: part.headers['content-type'] || mime.lookup(filename) || undefined,
  };

  let s3 = new S3();
  console.info(`Uploading '${filename}' to [${bucket}]: ${key}`);
  s3.upload(params, function(err, data) {
    if (err) return next(err);
    next(null, {
      key: data.Key,
      bucket: data.Bucket,
      url: data.Location,
    });
  });
}


module.exports = function(req, res, next) {
  let bucket = config.S3_BUCKET_MAP[req.header('SP-Environment')];
  if (!bucket) {
    res.status(400).json({'error': 'No target bucket'});
    return;
  }
  let form = new multiparty.Form();
  form.on('error', next);
  form.on('part', function(part) {
    if (!part.filename) return;
    uploadToS3(part, bucket, function(err, data) {
      if (err) return next(err);
      console.log(data);
      res.json(data);
    });
  });
  form.parse(req);
};

// let uuid = require('node-uuid'),
//     multiparty = require('multiparty'),
//     Batch = require('batch'),
//     request = require('request'),
//     config = require('../config'),
//     uploadToS3 = require('./uploadToS3');


// module.exports = function(req, res, next) {
//   let form = new multiparty.Form(),
//       batch = new Batch(),
//       friend_id = '',
//       code = '';

//   batch.push(function(callback) {
//     form.on('field', function(name, value) {
//       console.log(name + ' ' +  value);
//       if (name === 'code') code = value;
//       else if (name === 'friend_id') friend_id = value;
//       callback(null, value);
//     });
//   });

//   batch.push(function(callback) {
//     form.on('part', function(part) {
//       if (!part.filename) return;
//       callback(null, part);
//     });
//   });

//   batch.end(function(err, results) {
//     if (err) return next(err);
//     uploadToS3(results[1], function(err, data) {
//       if (err) return next(err);
//       let url = 'http://' + config.SIMPLEPRINTS_DOMAIN + '/labs/code/' + code + '/images/';
//       request.post({
//         url: url,
//         formData: {
//           'original_url': data.url,
//           'friend_id': friend_id,
//         }
//       }, function(err, response, body) {
//         res.json(JSON.parse(body));
//       });
//     });
//   });

//   form.on('error', next);
//   form.parse(req);
// };
