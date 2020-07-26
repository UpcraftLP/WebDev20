'use strict';
const maps = require('./maps');

const baseURL = '/api/v1';

const getPageCount = (callback) => {
  const http = new XMLHttpRequest();
  const url = baseURL + '/pages';
  http.open('GET', url);
  http.responseType = 'json';
  http.setRequestHeader('Content-Type', 'application/json');
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      callback(Math.ceil(http.response.data / 10.0));
    }
  };
  try {
    http.send();
  } catch (e) {
    console.log(e);
  }
};

const updatePosts = (page, pageCount) => {
  const http = new XMLHttpRequest();
  http.open('GET', `${baseURL}/posts?page=${page}`);
  http.responseType = 'json';
  http.setRequestHeader('Content-Type', 'application/json');
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      const postSection = document.getElementById('postContainer');
      const postList = {};
      http.response.data.forEach(async d => {
        const id = d.post_id;
        const req = new XMLHttpRequest();
        req.open('GET', `${baseURL}/posts/${id}`);
        req.responseType = 'json';
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = () => {
          if (req.readyState === 4 && req.status === 200) {
            const json = req.response.data;
            const li = document.createElement('li');
            const created = document.createElement('p');
            created.className = 'entry-timestamp';
            created.innerHTML = new Date(json.creation_time).toLocaleString();
            li.appendChild(created);
            if (json.data) {
              const attachment = document.createElement('div');
              attachment.className = 'entry-attachment';

              if (json.type === 'application/geo+json') {
                const map = document.createElement('div');
                attachment.appendChild(map);
                map.className = 'entry-map';
                maps.create(map, {
                  center: { lat: 0, lng: 0 },
                  zoom: 4
                }, json.data);
              } else if (json.type === 'image/jpeg') {
                const img = document.createElement('img');
                img.src = 'data:application/jpeg;' + json.data;
                img.className = 'entry-img';
                attachment.appendChild(img);
              } else {
                console.error('error displaying unknown mime type: ' + json.type);
              }
              li.appendChild(attachment);
            }

            const textNode = document.createElement('p');
            textNode.className = 'entry-text';
            textNode.innerHTML = json.text;
            li.appendChild(textNode);
            const del = document.createElement('button');
            del.innerHTML = 'Post entfernen';
            del.addEventListener('click', () => {
              const delReq = new XMLHttpRequest();
              delReq.open('POST', `${baseURL}/posts/${id}/delete`);
              delReq.setRequestHeader('Content-Type', 'application/json');
              delReq.onreadystatechange = () => {
                if (delReq.readyState === 4) {
                  window.rebuildPage();
                  getPageCount(count => {
                    if (count === 0) {
                      // force reload to fix page state
                      location.reload();
                    }
                  });
                }
              };
              try {
                delReq.send();
              } catch (e) {
                console.log(e);
              }
            });
            li.appendChild(del);
            postList[json.creation_time] = li;
            postSection.innerHTML = ''; // clear posts section
            const keysSorted = Object.keys(postList).sort();
            for (let i = keysSorted.length; i > 0; i--) {
              postSection.appendChild(postList[keysSorted[i - 1]]);
            }
          }
        };
        try {
          req.send();
        } catch (e) {
          console.log(e);
        }
      });
      Array.prototype.forEach.call(document.getElementsByClassName('pageNumber'), el => {
        el.innerHTML = `Seite ${page} / ${pageCount}`;
      });
    }
  };

  try {
    http.send();
  } catch (e) {
    console.log(e);
  }
};

module.exports.getPageCount = getPageCount;
module.exports.updatePosts = updatePosts;
