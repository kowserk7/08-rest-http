'use strict';
const Note = require('../model/note');
const storage = require('../lib/storage');
const debug = require('debug')('http:route-note');

module.exports = function (router) {
  router.post('/api/v1/note', (req,res) => {
    debug('POST /api/v1/note');
    let newNote;
    try {
      newNote = new Note(req.body.title, req.body.content);
    } catch (err) {
      debug(`There was a bad request: ${err}`);
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('Bad Request');
      res.end();
    }
    storage.create('Note', newNote)
      .then(storedNote => {
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(storedNote));
        res.end();
        return;
      })
      .catch(err => {
        debug(`There was a bad request: ${err}`);
        res.writeHead(400, {'Constent-Type': 'text/plain'});
        res.write('Bad Request');
        res.end();
        return;
      });  
  });
  router.get('/api/v1/note', (req,res) => {
    if(req.url.query._id) {
      storage.fetchOne('Note', req.url.query._id)
        .then(note => {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write(JSON.stringify(note));
          res.end();
        })
        .catch(err => {
          if (err.message.includes('400')){
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.write('Bad Request');
            res.end();
            return;
          }
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.write('Not found - get');
          res.end();
        });
      return;
    }
    storage.fetchAll('Note') 
      .then(ids => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(ids));
        res.end();
      })
      .catch(err => {
        if (err.message.startsWith('400')){
          res.writeHead(400, {'Content-Type': 'text/plain'});
          res.write('Bad Request');
          res.end();
        }
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not Found - get all');
        res.end();
      });
  });
  router.put('/api/v1/note', (req,res) => {
    debug('PUT /api/v1/note');
    try {
      let newNote = new Note(req.body.title, req.body.content);
      newNote._id = req.url.query._id; 
      storage.update('Note', newNote)
        .then(storedNote => {
          res.writeHead(201, {'Content-Type': 'application/json'});
          res.write(JSON.stringify(storedNote));
          res.end();
          return;
        })
        .catch(err => {
          debug(`There was a bad request: ${err}`);
          res.writeHead(400, {'Constent-Type': 'text/plain'});
          res.write('Bad Request');
          res.end();
          return;
        });  
    } catch (err) {
      debug(`There was a bad request: ${err}`);
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('Bad Request');
      res.end();
    }
  });
  router.delete('/api/v1/note', (req,res) => {
    try {
      storage.delete('Note', req.url.query._id)
        .then (() => {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.write('Record successfully deleted');
          res.end();
        })
        .catch (err => {
          debug(`There was a bad request: ${err}`);
          res.writeHead(400, {'Content-Type': 'text/plain'});
          res.write('Bad Request');
          res.end();
          return;
        });
    } catch (err) {
      debug(`There was a bad request: ${err}`);
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('Bad Request');
      res.end();
    }
  });
};