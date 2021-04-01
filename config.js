module.exports = config = {
  S3_BUCKET: process.env.S3_BUCKET,
  S3_BUCKET_TEST: process.env.S3_BUCKET_TEST,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  DOMAIN: process.env.DOMAIN,
  PORT: process.env.PORT || 3000,
};

config.S3_BUCKET_MAP = {
  'production': config.S3_BUCKET,
  'development': config.S3_BUCKET_TEST,
  'local': config.S3_BUCKET_TEST,
};

var aws = require('aws-sdk')
aws.config.update({
  accessKeyId: config.AWS_KEY,
  secretAccessKey: config.AWS_SECRET,
});
