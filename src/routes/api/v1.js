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
router.post('/post/create', async (req, res, next) => {
  const json = req.body;
  await db(async database => {
    if (json.attachment) {
      const att = json.attachment.split(';', 2);
      if (att.length !== 2) {
        const status = 400;
        return res.status(status).json({ status: status, message: 'Bad Request', error: 'Invalid Attachment', error_data: json.attachment });
      }
      let type = att[0].substring('data:'.length);
      if (type === 'application/json' || type === 'application/geo+json') {
        type = 'application/geo+json';
      } else {
        type = 'image/jpeg';
      }

      await database.run('INSERT INTO attachments (type, data) VALUES (?, ?)', type, att[1]);
      const storedAttachment = await database.get('SELECT attachments.id FROM attachments WHERE attachments.ROWID = LAST_INSERT_ROWID()');
      await database.run('INSERT INTO posts (creation_time, text, attachment_id) VALUES (DATETIME(\'now\'), ?, ?)', json.text, storedAttachment.id);
    } else {
      await database.run('INSERT INTO posts (creation_time, text) VALUES (DATETIME(\'now\'), ?)', json.text);
    }
    const storedPost = await database.get('SELECT post_id FROM posts WHERE posts.ROWID = LAST_INSERT_ROWID()');
    // the URI where the new post is available
    const postURI = `/${storedPost.post_id}`;
    const status = 201;
    res.location(postURI).status(status).json({ status: status, message: 'Created' });
  });
});

// retrieve information about a post
router.get('/posts/:id', async (req, res, next) => {
  // get post information
  const postId = req.params.id;
  try {
    const post = await db(async database => database.get(`SELECT posts.creation_time, posts.text, attachments.type, attachments.data FROM posts LEFT OUTER JOIN attachments ON posts.attachment_id = attachments.id WHERE posts.post_id = ${postId}`));
    if (post) {
      const status = 200;
      res.status(status).json({ status: status, message: 'OK', post: postId, data: post });
    } else {
      next();
    }
  } catch (e) {
    const status = 500;
    res.status(status).json({ status: status, message: 'Internal Server Error' });
  }
});

// delete post (and attachment, if any)
router.post('/posts/:id/delete', (req, res, next) => {
  // get post information
  const postId = req.params.id;
  try {
    db(async database => {
      await database.run('DELETE FROM attachments WHERE attachments.id in(SELECT posts.attachment_id from posts where posts.post_id = ?)', postId); // we don't deduplicate data, so this should be fine
      database.run('DELETE FROM posts WHERE post_id = ?', postId);
    });
    const status = 200;
    return res.status(status).json({ status: status, message: 'OK', post: postId });
  } catch (e) {
    console.log(e);
    const status = 500;
    res.status(status).json({ status: status, message: 'Internal Server Error' });
  }
});

// modify post
// currently not supported, because not required in the assignment
router.post('/posts/:id/modify', (req, res, next) => {
  const postId = req.params.id;
  res.status(501).json({ status: 501, message: 'Not Implemented', post: postId });
});

router.get('/pages', async (req, res, next) => {
  const data = await db(async database => database.all('SELECT COUNT(*) FROM posts'));
  if (data) {
    const status = 200;
    res.status(status).json({ status: status, message: 'OK', data: data[0]['COUNT(*)'] });
  } else {
    const status = 500;
    res.status(status).json({ status: status, message: 'Internal Server Error' });
  }
});

// list posts
router.get('/posts', async (req, res, next) => {
  // use req.query.$key to get query parameters
  const page = req.query.page ? req.query.page : 1;
  // const sortingOrder = req.query.sort ? req.query.sort : 'latest';
  const sqlOffset = (page - 1) * 10;
  // SELECT DISTINCT Name name FROM playlists ORDER BY name
  const data = await db(async database => database.all(`SELECT DISTINCT post_id FROM posts ORDER BY creation_time DESC limit 10 offset ${sqlOffset}`));
  if (data) {
    const status = 200;
    res.status(status).json({ status: status, message: 'OK', data: data });
  } else {
    const status = 500;
    res.status(status).json({ status: status, message: 'Internal Server Error' });
  }
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
