#!/usr/bin/env node

const app = require('./app');
const http = require('http');
const { debugInfo, debugError } = require('./middlewares/logs');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      debugError(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debugError(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  const message = `Listening on ${bind}`;
  debugInfo(message);
}


global.appPath = __dirname;


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
