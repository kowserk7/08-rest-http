'use strict';

const urlParser = require('url');
const queryString = require('querystring');
const debug = require('debug')('http:url-parser');

module.exports = function(request) {
  request.url = urlParser.parse(request.url);
  request.url.query = queryString.parse(request.url.query);
  return Promise.resolve(request);
};