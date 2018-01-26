'use strict';

const uuid = require('uuid/v4');
const debug = require('debug')('http:note-constructor');

module.exports = function(title, content) {
  if (!title) return (new Error('Title required'));
  if (!content) return (new Error ('Content required'));

  this.title = title;
  this.content = content;
  this._id = uuid();
  debug(`Created a note: ${this}`);
};