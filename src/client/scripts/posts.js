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
      postSection.innerHTML = ''; // clear posts section
      http.response.data.forEach(d => {
        const id = d.post_id;
        const req = new XMLHttpRequest();
        req.open('GET', `${baseURL}/posts/${id}`);
        req.responseType = 'json';
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = () => {
          if (req.readyState === 4 && req.status === 200) {
            const json = req.response.data;
            console.log(json);
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(json.text));
            li.appendChild(document.createTextNode(json.creation_time));
            postSection.appendChild(li);
          }
        };
        try {
          req.send();
        } catch (e) {
          console.log(e);
        }
      });
      document.getElementById('pageNumber').innerHTML = `Seite ${page} / ${pageCount}`;
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
