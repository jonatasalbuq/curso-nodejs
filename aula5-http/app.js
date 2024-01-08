const http = require('http');

http.createServer((req, res) => {
    res.write("Hello, World! Welcome to my website.");
    res.end();
}).listen(8080);

console.log("Servidor rodando...");