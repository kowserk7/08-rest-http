'use strict';

const http = require('http');
const Router = require('./router');

const router = new Router ();
require('../route/route-note')(router);

const app = http.createServer(router.route());

const server = module.exports = {};
server.start = (port, cb) => app.listen(port, cb);
server.stop = (cb) => app.close(cb);

