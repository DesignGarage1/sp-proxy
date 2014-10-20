var config = require('./config');
var exports = module.exports = { proxies: [], startTime: Date() };


exports.init = function() {
  for (var i = 0; i < config.PROXIES.length; ++i) {
    exports.proxies.push({
      domain: config.PROXIES[i],
      processed: 0,
      processing: 0 });
  }
}


exports.getProxy = function() {
  var proxy = exports.proxies[0];

  for (var i = 1; i < config.PROXIES.length; ++i) {
    var obj = exports.proxies[i];
    if (obj.processing < proxy.processing ||
        (obj.processing == proxy.processing &&
         obj.processed < proxy.processed)) {
      proxy = obj
    }
  }

  return proxy;
}
