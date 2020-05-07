'use strict';
const express = require('express');
const logger = require('morgan');
const path = require('path');
const apiRouter = require('./routes/api');
const strings = require('./util/strings');

const app = express();

// for all errors that have specific pages
const errorPages = [404, 500];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/api', apiRouter); // our REST api
app.use(express.static(path.join(__dirname, 'static')));

// handle all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  if (errorPages.includes(err.status)) {
    res.redirect(`/error/${err.status}.html`);
  } else {
    res.status(500).json({ error: err });
  }
});

// catch 404 and forward to error handler
app.use((req, res) => {
  if (!strings.isBlank(req.path) && !req.path.toLowerCase().endsWith('.html')) {
    res.sendfile(`${req.path}.html`);
  } else {
    res.redirect('/error/404.html');
  }
});

module.exports = app;
module.exports.shutdown = apiRouter.shutdownDB;
