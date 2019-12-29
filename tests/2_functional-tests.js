/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Marianela',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isNull(err);
            assert.isNotNull(res.body._id);
            assert.isNotNull(res.body.title);
            done();
        });        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            assert.notEqual(res.status, 200);
            assert.isNotNull(err);
            done();
        });        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isNull(err);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.isNotNull(res.body[0].commentcount);
            assert.isNotNull(res.body[0].title);
            assert.isNotNull(res.body[0]._id);
            done();
        });        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/1ee80a4496c23f118b93e94a')
          .send({})
          .end(function(err, res){
            assert.notEqual(res.status, 200);
            assert.isNotNull(err);
            done();
        });        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/5e083a300b8bc316dc5c9881')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isNull(err);
            assert.isArray(res.body.comments, 'response comments should be an array');
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.isNotNull(res.body.title);
            assert.isNotNull(res.body._id);
            done();
        });        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .get('/api/books/5e083a300b8bc316dc5c9881')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isNull(err);
            assert.isArray(res.body.comments, 'response comments should be an array');
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.isNotNull(res.body.title);
            assert.isNotNull(res.body._id);
            assert.isNotNull(res.body.comments[0]);
            done();
        });        
      });
      
    });

  });

});
