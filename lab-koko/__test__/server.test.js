'use strict';

const server = require('../lib/server');
const superagent = require ('superagent');


describe('Server Integration Testing', () => {
  beforeAll(() => server.start(4000));
  afterALL(() => server.stop());
  let resPost;

  describe('Valid requests', () => {
    describe('POST /api/v1/note', () => {
      beforeAll(() => {
        return superagent.post(':4000/api/b1/note')
          .send({title: 'Hello', content: 'watman'})
          .then (res => {
            resPost = res;
          });
      });
      it ('should post an dcreate a new record', () => {
        expect(resPost.body.title).toEqual('Hello');
        expect(resPost.body.content).toEqual('watman');
      });
      it ('should responf with an status of 201', () => {
        expect(resPost.status).toBe(201);
      });
      it ('should have an _id property on the response object', () => {
        expect(res.body).toHaveProperty('_id');
      });
    });
    describe('GET /api/v1/note', () => {
      let postOne, postTwo, getOne;
      beforeAll(() => {
        return superagent.post(':4000/api/b1/note')
          .send({title: 'Hello', content: 'watman'})
          .then (res => {
            postOne = res;
          });
      });
      beforeAll(() => {
        return superagent.post(':4000/api/b1/note')
          .send({title: 'Bye', content: 'watman'})
          .then (res => {
            postTwo = res;
          });
      });
      beforeAll(() => {
        return superagent.get(':4000/api/v1/note')
          .then(res => getOne = res);
      });

      it('shouuld return an array of ids', () => {
        getOne.body.map(id, () => {
          expect(id).toMatch();
        });
      });
      it ('shoild return a status of 200', () => {

      });
      it ('should contain the two ids pf records posted', () => {

      });
    });
    describe('GET /api/v1/note?_id=<record id>', () => {

    });
  });

  describe('Invalid requests', () => {
    describe('POST/api/v1/note', () => {
      it ('should return 404 given an incorrect path', () => {
        return superagent.post(':4000/api/v1/notvalid')
          .send({title: '', content: ''})
          .catch(err =>{
            expect(err.status).toBe(400);
          });
      });
      it ('should return 400 given no body of data on request', () => {
        return superagent.post(':4000/api/v1/notvalid')
          .send()
          .catch(err =>{
            expect(err.status).toBe(404);
          });
      });
    });
  });
});