'use strict';
const express = require('express');
const db = require('../../util/database');

const router = express.Router();

// check content type
router.use('/', (req, res, next) => {
  if (req.header('Content-Type') !== 'application/json') {
    const status = 400;
    return res.status(status).json({ status: status, message: 'Bad Request', error: 'Invalid Content Type' });
  }
  next();
});

// create post
router.post('/post/create', (req, res, next) => {
  // the URI where the new post is available
  const postURI = '/';
  console.log(`body: ${JSON.stringify(req.body)}`);
  const status = 201;
  res.location(postURI).status(status).json({ status: status, message: 'Created' });
});

// retrieve information about a post
router.get('/posts/:id', (req, res, next) => {
  // get post information
  const postId = req.params.id;
  const status = 200;
  res.status(status).json({ status: status, message: 'OK', post: postId });
});

// delete post (and attachment, if any)
router.post('/posts/:id/delete', (req, res, next) => {
  const postId = req.params.id;
  const status = 202;
  res.status(status).json({ status: status, message: 'Post Deleted', post: postId });
});

// modify post
// currently not supported, because not required in the assignment
router.post('/posts/:id/modify', (req, res, next) => {
  const postId = req.params.id;
  res.status(501).json({ status: 501, message: 'Not Implemented', post: postId });
});

// list posts
router.get('/posts', (req, res, next) => {
  // use req.query.$key to get query parameters
  // const page = req.query.page ? req.query.page : 1;
  // const sortingOrder = req.query.sort ? req.query.sort : 'latest';
  const status = 200;
  res.status(status).json({ status: status, message: 'OK' });
});

// catch 404 for api calls and respond with json message
router.use((req, res, next) => {
  const status = 404;
  res.status(status).json({ status: status, message: 'Not Found' });
});

module.exports = router;
module.exports.shutdownDB = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Closed the database connection.');
    }
  });
};
