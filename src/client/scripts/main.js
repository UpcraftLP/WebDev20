'use strict';
require('../styles/style.css');
require('./include');
require('./submit');
const posts = require('./posts');

let page = 1;
let pageCount;

const updateButtons = () => {
  posts.updatePosts(page, pageCount);
  const prv = page <= 1;
  const nxt = page >= pageCount;
  Array.from(document.getElementsByClassName('prev-button')).forEach(btn => {
    btn.disbled = prv;
    console.log("disabled prev: " + prv + ";" + btn);
  });
  Array.from(document.getElementsByClassName('next-button')).forEach(btn => {
    btn.disbled = nxt;
    console.log("disabled next: " + nxt);
  });
};
window.rebuildPage = updateButtons;

Array.from(document.getElementsByClassName('prev-button')).forEach(prevBtn => {
  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      page -= 1;
    }
    updateButtons();
  });
});
Array.from(document.getElementsByClassName('next-button')).forEach(nextBtn => {
  nextBtn.addEventListener('click', () => {
    if (page < pageCount) {
      page += 1;
    }
    updateButtons();
  });
});

posts.getPageCount(count => {
  pageCount = count;
  updateButtons();
});
