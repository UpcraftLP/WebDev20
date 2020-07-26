'use strict';
require('../styles/style.css');
require('./include');
require('./submit');
const posts = require('./posts');

let page = 1;
let pageCount;

const updateButtons = () => {
  const prePageCount = pageCount;
  posts.updatePosts(page, pageCount);
  const prv = page <= 1;
  const nxt = page >= pageCount;
  Array.prototype.forEach.call(document.getElementsByClassName('prevButton'), btn => {
    btn.disbled = prv;
  });
  Array.prototype.forEach.call(document.getElementsByClassName('nextButton'), btn => {
    btn.disbled = nxt;
  });
  posts.getPageCount(count => {
    if(prePageCount !== 0 && count === 0) {
      // force reload to fix page state
      location.reload();
    }
  });
};
window.rebuildPage = updateButtons;

Array.prototype.forEach.call(document.getElementsByClassName('nextButton'), nextBtn => {
  nextBtn.addEventListener('click', () => {
    if (page < pageCount) {
      page += 1;
    }
    updateButtons();
  });
});

Array.prototype.forEach.call(document.getElementsByClassName('prevButton'), prevBtn => {
  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      page -= 1;
    }
    updateButtons();
  });
});

posts.getPageCount(count => {
  pageCount = count;
  updateButtons();
});
