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
    return resolve(memory[schema][item._id]);
  });
};

storage.fetchOne = function(schema, itemId) {
  return new Promise ((resolve, reject) => {
    if(!schema) return reject(new Error ('400 Cannot find record. Schema required'));
    if(!itemId) return reject(new Error('400 Cannot find record. Item ID required'));
    if (!memory[schema][itemId]) return reject(new Error('Cannot find record. Does not exist'));

    return resolve (memory[schema][itemId]);
  });
};

storage.fetchAll = function(schema) {
  return new Promise((resolve, reject) => {
    if(!schema) return reject (new Error ('400, Cannot find reord. Schema required'));
    if(!memory[schema]) return reject(new Error ('400, cannot complete request. No records match Schema'));
    let ids = Object.keys(memory[schema]);
    return resolve(ids);
  });
};

storage.update = function(schema, itemId, item) {
  //NEW SHIT
  return new Promise((resolve, reject) => {
    if(!schema) return reject (new Error ('400, Cannot find reord. Schema required'));
    if(!memory[schema]) return reject(new Error ('400, cannot complete request. No records match Schema'));
    memory[schema][item._id] = item; //this is the new data being updated and overiding current memory
    return resolve(memory[schema][item._id]); //overide
  //NEW SHIT
  });
};

storage.delete = function(schema, itemId) {
  return new Promise((resolve, reject) => {
    if(!schema || !itemId) return reject (new Error ('400, Cannot find reord. Schema required'));
    if(!memory[schema]) return reject(new Error ('400, cannot complete request. No records match Schema'));
    delete (memory[schema][itemId]);
    //return resolve(memory[schema][item._id]); //overide
  //NEW SHIT
  });
};