var proxy = require('../proxy');


module.exports = function(req, res) {
  res.json({
    proxies: proxy.proxies,
    startTime: proxy.startTime
  });
}
