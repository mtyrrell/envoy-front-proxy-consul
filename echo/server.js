// imports
const http = require('http');

// constants
const cloud = process.env.CLOUD ? process.env.CLOUD : 'dev';
const port = process.env.PORT ? process.env.PORT : 3000;
const region = process.env.REGION ? process.env.REGION : 'dev';

http.createServer(function (request, response) {

    let pong = {
        cloud : cloud,
        data : null,
        port : port,
        region : region,
    };

    request.on('data', chunk => {
        pong.data = `${chunk}`;
    });
    
    request.on('end', () => {
        response.writeHead(200);
        response.write(JSON.stringify(pong));
        response.end();
    });

}).listen(port, function() {
    console.log(`listening on port ${port}`);
});