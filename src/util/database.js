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
    // check whether table exists
    const arr = await database.all('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'posts\'');
    const populateDB = global.debug && !arr.length;
    // create tables
    await database.run('CREATE TABLE IF NOT EXISTS attachments (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, type TEXT NULL, data TEXT NULL)');
    await database.run('CREATE TABLE IF NOT EXISTS posts (post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, creation_time TEXT NOT NULL, text TEXT NOT NULL, attachment_id INTEGER NULL, FOREIGN KEY(attachment_id) REFERENCES attachments(id))');

    if (populateDB) {
      const statement = await database.prepare('INSERT INTO posts (creation_time, text) VALUES (DATETIME(?), ?)');
      try {
        const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
          'Donec sem risus, ultricies vitae turpis sit amet, molestie mattis justo.\n' +
          'Nulla dignissim mauris ut dolor sollicitudin semper. Aenean nec accumsan leo.\n' +
          'Sed fermentum, ipsum eget semper dictum, odio dui dictum urna, eu pretium purus nisl in risus.\n' +
          'Ut pharetra tellus non dui convallis congue.\n' +
          'Vestibulum porta, felis at pellentesque rhoncus, purus diam accumsan ipsum, eget vehicula purus leo a erat.\n' +
          'Phasellus blandit, lectus quis placerat tempor, libero massa vestibulum libero, id auctor nibh augue in lorem.\n' +
          'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n' +
          'Curabitur erat augue, fringilla quis ipsum non, condimentum finibus dui.\n' +
          'Duis dui nisl, pharetra vel suscipit ut, sodales quis turpis.\n' +
          'Quisque efficitur tempor nisl in faucibus.\n' +
          'Pellentesque interdum arcu et semper sollicitudin.\n' +
          'Aenean lacinia feugiat leo, vel ultricies dui aliquet ac.\n' +
          'Aenean id velit id tortor cursus suscipit eu et orci.';
        await statement.run('now', str);
        await statement.run('2008-12-30T09:34', str);
        await statement.run('2018-12-30T11:39', str);
        await statement.run('2019-12-30T21:54', str);
        await statement.run('2020-05-30T09:44', str);
        await statement.finalize();
      } catch (e) {
        console.error('unable to write sample data');
        console.error(e);
      }
    }
  });
})();

module.exports = processDB;
