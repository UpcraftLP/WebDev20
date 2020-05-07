'use strict';
const express = require('express');
const db = require('../util/database');

const router = express.Router();

// TODO do stuff with router
router.post('create', (req, res, next) => {
  // create post
  res.status(200).json({ status: 200, message: 'ok' });
});

// catch 404 for api calls and respond with json message
router.use((req, res, next) => {
  res.status(404).json({ status: 404, error: 'Not Found' });
});
module.exports = router;
module.exports.shutdownDB = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
  console.log('Closed the database connection.');
};
