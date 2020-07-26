'use strict';

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const form = document.getElementById('form-submit');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // const form = document.getElementById('form-submit');
    const text = document.getElementById('input-text').value;
    const attachment = document.getElementById('input-attachment');
    const xhr = new XMLHttpRequest();
    const url = `${window.location.protocol}//${window.location.host}/api/v1/post/create`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const json = {
      text: text
    };
    if (attachment.files.length > 0 && attachment.files[0].size > 0) {
      json.attachment = await toBase64(attachment.files[0]);
    }
    const data = JSON.stringify(json);

    try {
      xhr.send(data);
    } catch (e) {
      console.log(e);
    }
  });
}
