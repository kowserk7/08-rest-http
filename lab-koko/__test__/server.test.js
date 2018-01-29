'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
require('jest');

describe('Server Integration Testing', function () {
  beforeAll(() => server.start(4000, () => console.log(`Listening on 4000`)));
  afterAll(() => server.stop());

  describe('POST /api/v1/note', () => {
    let resPost;

    beforeAll(() => {
      return superagent.post(':4000/api/v1/note')
        .send({ title: 'hello', content: 'watman' })
        .then(res => {
          resPost = res;
        });
    });

    it('should post and create a new record', () => {
      expect(resPost.body.title).toEqual('hello');
      expect(resPost.body.content).toEqual('watman');
    });
    it('should respond with a status code 201', () => {
      expect(resPost.status).toBe(201);
    });
    it('should have an _id property on the response object', () => {
      expect(resPost.body).toHaveProperty('_id');
    });
  });

  describe('GET /api/v1/note', () => {
    let postOne, postTwo, getOne;

    beforeAll(() => {
      return superagent.post(':4000/api/v1/note')
        .send({ title: 'hello', content: 'watman' })
        .then(res => {
          postOne = res;
        });
    });
    beforeAll(() => {

      return superagent.post(':4000/api/v1/note')
        .send({ title: 'bye', content: 'watwoman' })
        .then(res => {
          postTwo = res;
        });
    });

    beforeAll(() => {
      return superagent.get(':4000/api/v1/note')
        .then(res => getOne = res);
    });
    
    it('should return an array of ids', () => {
      getOne.body.map(id => {
        expect(id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      });
    });
    it('should return a status code of 200', () => {
      expect(getOne.status).toBe(200);
    });
    it('should contain the two ids of records posted', () => {
      expect(getOne.body).toContain(postOne.body._id);
      expect(getOne.body).toContain(postTwo.body._id);
    });
  });


  
  describe('PUT /api/v1/note', () => {
    let postOne, putOne;
    beforeAll(() => {
      return superagent.post(':4000/api/v1/note')
        .send({title: 'title', content: 'content'})
        .then( res => {
          postOne = res;
          return superagent.put(':4000/api/v1/note')
            .send({title: 'title2', content: 'content 2'})
            .then (res => {
              putOne = res;
            });
        });
    });
    it('should respond with a status code of 200', () => {
      expect(putOne.status).toBe(200);
    });    
    it('should responf with an error of 400', () => {
      return superagent.del(':4000/api/v1/note')
        .catch (err => {
          expect(err.status).toBe(400);
        });
    });
    it('should update a record', () => {
      return superagent.get(`:4000/api/v1/note?_id=${putOne.body._id}`)
        .then (res => {
          expect(res.body.content).toEqual('content 2');
          expect(res.body.title).toEqual('title2');
        });
    });
  });



  describe('DELETE /api/v1/note', () => {
    let postOne, postTwo;

    beforeAll(() => {
      return superagent.post(':4000/api/v1/note')
        .send({title: 'title', content: 'content'})
        .then(res => {
          postOne = res;
          return superagent.post(':4000/api/v1/note')
            .send({title: 'title2', content: 'content2'})
            .then(res => {
              postTwo = res;
            });
        });
    });
    it('should return with a status of 200', () => {
      return superagent.delete(`:4000/api/v1/note?_id=${postOne.body._id}`)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
    it('should check that the record was deleted', () => {
      return superagent.get(`:4000/api/v1/note?_id=${postTwo.body._id}`)
        .catch(res => {
          expect(res.status).toBe(400);
        });
    });
  });
});