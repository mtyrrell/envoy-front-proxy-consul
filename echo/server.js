/*
 * Copyright 2018 Expedia, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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