module.exports = {
  AWS_BUCKET: process.env.AWS_BUCKET,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  DOMAIN: process.env.DOMAIN,
  SIMPLEPRINT_DOMAIN: process.env.SIMPLEPRINT_DOMAIN || 'stage.getsimpleprints.com',
  PROXIES: [
    'http://sp-thumbor-0.herokuapp.com',
    'http://sp-thumbor-1.herokuapp.com',
    'http://sp-thumbor-2.herokuapp.com',
    'http://sp-thumbor-3.herokuapp.com',
    'http://sp-thumbor-4.herokuapp.com',
    'http://sp-thumbor-5.herokuapp.com',
  ],
}
