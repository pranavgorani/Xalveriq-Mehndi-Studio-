const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp' };
const files = new Set(['index.html','studio.css','studio.js','mood.js','config.js', ...['hero','bridal','arabic','minimal'].map(name=>'assets/'+name+'.webp')]);
http.createServer((req,res)=>{
  const route = new URL(req.url,'http://localhost').pathname.slice(1) || 'index.html';
  if (!files.has(route)) {res.writeHead(404).end();return;}
  fs.readFile(path.join(__dirname,route),(err,data)=>{
    if (err) {res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(route)],'Cache-Control':'no-cache'}).end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Xalveriq studio running at http://127.0.0.1:4173'));
