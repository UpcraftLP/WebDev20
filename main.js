#!/usr/bin/env node
'use strict';

// FIXME use express directly instead of http module
// spec requires this

const path = require('path');
const fs = require('fs');
const http = require('http');

global.debug = true;

global.runDir = path.resolve(__dirname, 'run');
if (!fs.existsSync(global.runDir)) {
  fs.mkdirSync(global.runDir);
}

const app = require(path.join(__dirname, 'src/app'));

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

const server = http.createServer(app);

// Normalize a port into a number, string, or false.
function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      break;
    default:
      throw error;
  }
  process.exit(1); // need this here instead of inside the switch, or semistandard and WebStorm's linter fight over whether to use break or not.
});
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'http://localhost:' + addr.port;
  console.log('Listening on ' + bind);
});
