require('dotenv').config();
require('enve');

const Express = require('express');
const proxy = require('cors-anywhere');
const path = require('path');

const app = Express();
if (process.enve.NODE_ENV == 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.enve.WEB_URL);
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}
app.use('/sw.js', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'dist', 'sw.js'))
);
app.use('/static', Express.static(path.resolve(__dirname, 'dist')));
app.get('/*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
);
app.listen(process.enve.SERVER_PORT, () =>
  console.log('Listening on', process.enve.SERVER_PORT)
);

proxy
  .createServer({
    originWhitelist: [process.enve.WEB_URL],
    requireHeader: ['origin', 'x-requested-with']
  })
  .listen(process.enve.PROXY_PORT, '127.0.0.1');
