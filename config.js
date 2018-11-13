module.exports = config = {
  AWS_BUCKET: process.env.AWS_BUCKET,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  DOMAIN: process.env.DOMAIN,
  PORT: process.env.PORT || 3000,
  SIMPLEPRINTS_DOMAIN: process.env.SIMPLEPRINTS_DOMAIN || 'stage.getsimpleprints.com',
  PROXIES: [
    'http://sp-thumbor-1.herokuapp.com',
    'http://sp-thumbor-2.herokuapp.com',
    'http://sp-thumbor-3.herokuapp.com',
    'http://sp-thumbor-4.herokuapp.com',
    'http://sp-thumbor-5.herokuapp.com',
    'http://sp-thumbor-6.herokuapp.com',
    'http://sp-thumbor-7.herokuapp.com',
    'http://sp-thumbor-8.herokuapp.com'
  ],
};

var aws = require('aws-sdk')
aws.config.update({
  accessKeyId: config.AWS_KEY,
  secretAccessKey: config.AWS_SECRET,
});
