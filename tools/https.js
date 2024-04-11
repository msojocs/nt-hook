// app.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const PORT = 443;
const options = {
  // 本地生成证书，域名: *.qpic.cn
  key: fs.readFileSync(path.resolve(__dirname, './server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, './server.crt'))
};

https.createServer(options, (req, res) => {
  res.setHeader('X-ErrNo', '123')
  res.writeHead(200);
  console.log('request:', req.url)
  res.end('Hello World!');
}).listen(PORT, () => console.log(`App listening on port ${PORT}!`));