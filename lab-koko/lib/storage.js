'use strict';

const debug = require('debug')('http:storage');
const storage = module.exports = {};
const memory = {};

storage.create = function(schema, item) {
  debug('Created a new thing');

  return new Promise ((resolve, reject) => {
    if (!schema || !item) return reject(new Error ('Cannot create a new item; Schema and Item required'));
    if (!memory[schema]) memory[schema] = {};
    memory[schema][item._id] = item;
    return resolve(menubar[schema[item._id]]);
  });
};

storage.fetchOne = function() {

};

storage.fetchAll = function() {

};

storage.update = function() {

};

storage.delet = function() {

};