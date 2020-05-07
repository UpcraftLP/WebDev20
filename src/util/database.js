'use strict';
const sqlite3 = require('sqlite3');
const path = require('path');

// noinspection JSUnresolvedVariable
const dbLocation = path.resolve(global.runDir, 'content.db');
const database = new sqlite3.Database(dbLocation, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});
console.log('Connected to database at ' + dbLocation);

// init the database
database.run('CREATE TABLE IF NOT EXISTS attachments (id TEXT NOT NULL PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL)');
database.run('CREATE TABLE IF NOT EXISTS posts (post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, creation_time DATE NOT NULL, attachment_id TEXT NULL, FOREIGN KEY(attachment_id) REFERENCES attachments(id))');

// TODO populate with sample data

module.exports = database;
