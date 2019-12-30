/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const CONNECTION_STRING = process.env.DB; 

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = function (app) {
  //create mongo connection
  mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  //calling models
  let bookModel = require('../models/book')(mongoose);
  let commentModel = require('../models/comment')(mongoose, ObjectId);
  //Note that this could be done using only one model for books containing it's own list of comments. 
  //That approach avoids the need to make a second query to obtain the comments, but will have a disadvantage in the maximum number of comments. 
  //Remember that a mongodb document has a size limit of 16 MB, so the chosen approach would allow to add as many comments per book as the users want

  app.route('/api/books')
    .get((req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //get all the books
      bookModel.find({}, (err, matches) => {
        if(err){
          res.status(500).send("An error occured while trying to get the list of books");
        }else{
          res.send(matches);
        }
      });
    })
    
    .post((req, res) => {
      let title = req.body.title;
      if(!title){
        //if there's no title, send a message
        res.status(412).send("It's not possible to create a book without a title");
      }else{
      //create the new book instance
        let book = new bookModel({
          title: title
        });
        book.save(err => {
          if(err){
            res.status(500).send("An error occured while trying to create a new book");
          }else{
            res.send(book);
          }
        });
      }
    })
    
    .delete((req, res) => {
      //delete every existing comment
      commentModel.deleteMany({}, err =>{
        if(err){
          res.status(500).send("An error occured while trying to delete the comments");
        }else{
          //delete every existing book
          bookModel.deleteMany({}, err =>{
            if(err){
              res.status(500).send("An error occured while trying to delete the books");
            }else{
              //if successful response will be 'complete delete successful'
              res.send("complete delete successful");
            }
          });
        }
      });
    });

  app.route('/api/books/:id')
    .get( (req, res) => {
      let bookid = req.params.id;
      if(!bookid){
        res.status(412).send("No book id provided");
      }else{
        //find the book
        bookModel.findById(bookid, (err, match) => {
          if(err){
            res.status(500).send("An error occured while trying to get a book");
          }else if(!match){
            res.status(404).send("Book not found");
          }else{
            let book = {
              _id: match._id,
              title: match.title,
              comments: []
            };
            if(match.commentcount > 0){
              //find the book's comments
              commentModel.find({book: bookid}, {"_id": 0, "book": 0}, (error, matches) => {
                if(matches && matches.length > 0){
                  matches.forEach(element => {
                    book.comments.push(element);
                  })
                }
                res.send(book);
              })
            }else{
              res.send(book);
            }
          }
        })
      }
    })
    
    .post((req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //create comment
      let newComment = new commentModel({
        book: bookid,
        comment: comment
      });
      newComment.save((err, data) => {
          if(err){
            res.status(500).send({error:"An error occured while trying to create a new comment"});
          }else{
            //udpate counter of comments of the book
            bookModel.findByIdAndUpdate(bookid, { $inc: { commentcount: 1 } }, (err, result) =>{
              if(err){
                res.status(500).send({error:"An error occured while trying to update the book"});
              }else{
                //json res format same as .get
                res.redirect("/api/books/" + bookid);
              }
            });
          }
        });
    })
    
    .delete((req, res) => {
      let bookid = req.params.id;
      //delete every existing comment on the chosen book
      commentModel.deleteMany({book: book}, err =>{
        if(err){
          res.status(500).send("An error occured while trying to delete the comments of the book");
        }else{
          //delete the selected book
          bookModel.findByIdAndRemove(book, err =>{
            if(err){
              res.status(500).send("An error occured while trying to delete the book");
            }else{
              //if successful response will be 'complete delete successful'
              res.send("delete successful");
            }
          });
        }
      });
    });
  
};
