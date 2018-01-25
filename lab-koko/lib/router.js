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
  this.routes.POST[endpoint] = callback;
};
Router.prototype.put = function(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};
Router.prototype.delete = function(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};