#!/usr/bin/env node
'use strict';
/**
 * Module dependencies.
 */
const path = require('path');
const fs = require('fs');
const http = require('http');
// const browserify = require('browserify');

global.runDir = path.resolve(__dirname, 'run');
if (!fs.existsSync(global.runDir)) {
  fs.mkdirSync(global.runDir);
}
const args = process.argv.slice(2);
const dbg = args[0] === '--dev';
if (dbg) {
  console.log('Debug Mode enabled.');
}

const app = require(path.join(__dirname, 'src/app'));

// const b = browserify({
//   entries: 'main.js',
//   cache: {},
//   packageCache: {},
//   debug: true
// });

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

// if (dbg) {
//  b.plugin(livereload, {
//    host: 'localhost',
//    port: port,
//    outfile: path.join(__dirname, 'src', 'generated/bundle.js')
//  });
// }

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('close', app.shutdown);
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
