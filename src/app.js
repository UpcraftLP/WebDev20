'use strict';
const express = require('express');
const logger = require('morgan');
const path = require('path');
const apiRouterV1 = require('./routes/api/v1');
const strings = require('./util/strings');

const app = express();

// for all errors that have specific pages
const errorPages = [404, 500];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/api/v1', apiRouterV1); // our REST api, version 1
app.use(express.static(path.join(__dirname, 'client/static')));

// handle all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  if (errorPages.includes(err.status)) {
    res.redirect(`/error/${err.status}`);
  } else {
    res.status(500).json({ error: err });
  }
});

// catch 404 and forward to error handler
app.use((req, res) => {
  if (!strings.isBlank(req.path) && !req.path.toLowerCase().endsWith('.html')) {
    res.sendfile(`${req.path}.html`);
  } else {
    res.redirect('/error/404');
  }
});

module.exports = app;
