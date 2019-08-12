const proxy = require('cors-anywhere');
require('dotenv').config();
require('enve');

proxy
  .createServer({
    originWhitelist: [process.enve.WEB_URL],
    requireHeader: ['origin', 'x-requested-with']
  })
  .listen(process.enve.PROXY_PORT, '127.0.0.1');
