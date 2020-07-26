'use strict';

const include = (file) => {
  const script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
};

module.exports = include;
