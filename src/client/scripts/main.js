'use strict';
require('../styles/style.css');

const form = document.getElementById('form-submit');
if(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // const form = document.getElementById('form-submit');
    const text = document.getElementById('input-text').value;
    const attachment = document.getElementById('input-attachment').value;

    const xhr = new XMLHttpRequest();
    const url = `${window.location.protocol}//${window.location.host}/api/v1/post/create`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const data = JSON.stringify({
      text: text,
      attachment: attachment
    });
    xhr.send(data);
  });
}
