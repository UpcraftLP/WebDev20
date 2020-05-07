'use strict';
const express = require('express');
const db = require('../../util/database');

const router = express.Router();

// create post
router.post('/post/create', (req, res, next) => {
  // the URI where the new post is available
  const postURI = '/';
  res.location(postURI).status(201).json({ status: 201, message: 'Created' });
});

// retrieve information about a post
router.get('/posts/:id', (req, res, next) => {
  // get post information
  const postId = req.params.id;
  res.status(200).json({ status: 200, message: 'ok', post: postId });
});

// delete post (and attachment, if any)
router.post('/posts/:id/delete', (req, res, next) => {
  const postId = req.params.id;
  res.status(202).json({ status: 202, message: 'Post Deleted', post: postId });
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
  res.status(200).json({ status: 200, message: 'ok' });
});

// catch 404 for api calls and respond with json message
router.use((req, res, next) => {
  res.status(404).json({ status: 404, message: 'Not Found' });
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
