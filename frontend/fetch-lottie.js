const https = require('https');

const data = JSON.stringify({
  query: '{ animation(slug: "ZltNpefmQj") { jsonUrl lottieUrl } }'
});

const options = {
  hostname: 'graphql.lottiefiles.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.on('error', console.error);
req.write(data);
req.end();
