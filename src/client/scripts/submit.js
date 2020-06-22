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
    console.log(attachment.value);

    const xhr = new XMLHttpRequest();
    const url = `${window.location.protocol}//${window.location.host}/api/v1/post/create`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const json = {
      text: text
    };
    if (attachment) {
      json.attachment = {
        type: 'json', // FIXME check file type
        data: await toBase64(attachment.files[0])
      };
    }
    const data = JSON.stringify(json);
    xhr.send(data);
  });
}
