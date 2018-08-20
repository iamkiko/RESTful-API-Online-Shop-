const http = require('http');
const app = require('./app');

// const port = process.env.PORT, process.env.IP;

const server = http.createServer(app);

// server.listen(port);

server.listen(process.env.PORT, process.env.IP, function(){
   console.log("Firing up...");
});