'use strict';

const server = require('./lib/server');


server.start(3000, () => console.log(`Listening on 3000`));