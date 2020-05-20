'use strict';
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

if (global.debug) {
  sqlite3.verbose();
}

const dbLocation = path.resolve(global.runDir, 'content.db');
console.log('Connected to database at ' + dbLocation);

const openDB = async () => sqlite.open({
  filename: dbLocation,
  driver: sqlite3.Database
}).catch(reason => {
  console.error(reason);
  process.exit(1);
});

const processDB = async (func) => {
  const database = await openDB();
  let result;
  try {
    result = await func(database);
  } catch (e) {
    console.error(e);
    result = null;
  }
  await database.close();
  return result;
};

// init the database on startup
(async () => {
  await processDB(async database => {
    // create tables
    await database.run('CREATE TABLE IF NOT EXISTS attachments (id TEXT NOT NULL PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL)');
    await database.run('CREATE TABLE IF NOT EXISTS posts (post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, creation_time TEXT NOT NULL, text TEXT NOT NULL, attachment_id TEXT NULL, FOREIGN KEY(attachment_id) REFERENCES attachments(id))');

    if (global.debug) {
      const statement = await database.prepare('INSERT INTO posts (creation_time, text) VALUES (?, ?)');
      // TODO populate with sample data
      await statement.run('CURRENT_TIMESTAMP', 'Sample Text');
      await statement.run('DATETIME(\'now\', \'start of month\')', 'Sample Text 2');
      await statement.run('DATETIME(\'now\', \'-1 month\')', 'Sample Text 3');
      await statement.run('DATETIME(\'now\', \'start of month\', \'+5 days\')', 'Sample Text 4');
      await statement.run('DATETIME(\'2008-12-30T09:34\')', 'Sample Text 234243');
      await statement.finalize();
    }
  });
})();

module.exports = processDB;
