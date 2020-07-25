#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');

global.debug = true;
global.runDir = path.resolve(__dirname, 'run');

if (!fs.existsSync(global.runDir)) {
  fs.mkdirSync(global.runDir);
}

let addr;
// Normalize a port into a number, string, or false.
const normalizePort = (p) => {
  const port = parseInt(p, 10);

  if (isNaN(port)) { // named pipe
    addr = p;
    return p;
  }

  if (port >= 0) { // port number
    addr = 'http://localhost:' + port;
    return port;
  }

  // invalid port or pipe
  addr = null;
  return false;
};

const app = require(path.join(__dirname, 'src/app'));

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

app.listen(port, () => console.log('Listening on ' + addr));
