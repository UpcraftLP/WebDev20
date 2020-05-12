'use strict';
const sqlite3 = require('sqlite3');
const path = require('path');

if (global.debug) {
  sqlite3.verbose();
}

const dbLocation = path.resolve(global.runDir, 'content.db');
const database = new sqlite3.Database(dbLocation, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});
console.log('Connected to database at ' + dbLocation);

const runAsync = (sql) =>
  new Promise((resolve, reject) => {
    database.run(sql, (err) => err ? reject(err) : resolve());
  });

runAsync('CREATE TABLE IF NOT EXISTS attachments (id TEXT NOT NULL PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL)')
  .then(() => runAsync('CREATE TABLE IF NOT EXISTS posts (post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, creation_time TEXT NOT NULL, text TEXT NOT NULL, attachment_id TEXT NULL, FOREIGN KEY(attachment_id) REFERENCES attachments(id))'))
  .then(() => {
    // init the database
    // TODO populate with sample data
    if (global.debug) {
      database.run('INSERT INTO posts (creation_time, text) VALUES (CURRENT_TIMESTAMP, \'Sample Text\')');
      database.run('INSERT INTO posts (creation_time, text) VALUES (DATETIME(\'now\', \'start of month\'), \'Sample Text 2\')');
      database.run('INSERT INTO posts (creation_time, text) VALUES (DATETIME(\'now\', \'-1 month\'), \'Sample Text 3\')');
      database.run('INSERT INTO posts (creation_time, text) VALUES (DATETIME(\'now\', \'start of month\', \'+5 days\'), \'Sample Text 4\')');
      database.run('INSERT INTO posts (creation_time, text) VALUES (DATETIME(\'2008-12-30T09:34\'), \'Sample Text 234243\')');
    }
  });
module.exports = database;
