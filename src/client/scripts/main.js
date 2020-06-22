'use strict';
require('../styles/style.css');
require('./submit');
const posts = require('./posts');

let page = 1;
let pageCount;

const updateButtons = () => {
  const nextButton = document.getElementById('nextButton');
  const prevButton = document.getElementById('prevButton');
  if (prevButton && nextButton) {
    posts.updatePosts(page, pageCount);
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= pageCount;
  }
};

const nextBtn = document.getElementById('nextButton');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (page < pageCount) {
      page += 1;
    }
    updateButtons();
  });
}
const prevBtn = document.getElementById('prevButton');
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      page -= 1;
    }
    updateButtons();
  });
}

posts.getPageCount(count => {
  pageCount = count;
  updateButtons();
});
