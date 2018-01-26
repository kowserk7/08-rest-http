'use strict';

const debug = require('debug')('http:Router');
const bodyParser = require('./body-parser');
const urlParser = require('./url-parser');

const Router = module.exports = function() {
  this.routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

Router.prototype.get = function(endpoint, callback) {
  this.routes.GET[endpoint] = callback;
};

Router.prototype.post = function(endpoint, callback) {
  console.log(this.routes.POST[endpoint], 'wtf');
  this.routes.POST[endpoint] = callback;
};

Router.prototype.put = function(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};

Router.prototype.delete = function(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};

Router.prototype.route = function() {
  return (req, res) => {
    Promise.all([
      urlParser(req),
      bodyParser(req),
    ])
      .then(() => {
        debug('Successfully parsed the Body and URL');
        // console.log(this.routes.POST, req.url);
        // console.log(this.routes[req.method][req.url.pathname], 'got here');

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.routes[req.method]);
        if(typeof this.routes[req.method][req.url.pathname] === 'function') {
          console.log('>>>>>>>>>>>>>>>: before routes', req.method);
          
          this.routes[req.method][req.url.pathname](req, res);

          return;
        }

        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not Found post');
        res.end();
        return;
      })
      .catch(err => {
        debug(`There was an error parsing the URL or Body: ${err}`);

        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write('Bad Request');
        res.end();
        return;
      });
  };
};