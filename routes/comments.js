const express = require('express');
const moment = require('moment');
const shortid = require('shortid');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const commentData = require('../data');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

// create db file if it doesnt exist and seed it with data
const adapter = new FileSync('db.json', {
  defaultValue: {
    comments: commentData,
  },
});
const db = lowdb(adapter);

const router = express.Router();

// get all comments
router.get('/', (req, res) => {
  // let comments = db.get('comments').value();
  // if (req.query.filter) {
  //   const filterText = req.query.filter;
  //   comments = comments.filter(comment => comment.text.toLowerCase().includes(filterText.toLowerCase()));
  // }
  // res.json(comments);
  Comment.find()
    .where('text')
    .regex(req.query.filter || '')
    .then(comments => res.json(comments));
});

// GET /comments?filter="your text here"

// get a single comment by id
router.get('/:id', (req, res) => {
  // const myComment = db
  //   .get('comments')
  //   .find({
  //     id: req.params.id,
  //   })
  //   .value();
  // if (myComment) {
  //   res.json(myComment);
  // } else {
  //   res.status(404).json({
  //     msg: 'Invalid ID',
  //   });
  // }
  Comment.findById(req.params.id)
    .then(comment => (comment ? res.json(comment) : res.status(404).json({ message: 'Invalid ID' })))
    .catch(err => res.status(500).json(err));
});

// create a comment
router.post('/', (req, res) => {
  if (!req.body.text || !req.body.userId) {
    return res.status(400).json({ msg: 'Invalid syntax: please provide valid text' });
  }

  Comment.create({ text: req.body.text, user: req.body.userId })
    // update the user's comments
    .then(comment =>
      User.findByIdAndUpdate(req.body.userId, {
        $push: { comments: comment._id },
      })
    )
    .then(() => Comment.find())
    .then(comments =>
      res.status(201).json({
        message: 'Comment successfully added',
        comments,
      })
    );
});

// updates a comment
// findbyIdandUpdate
// findandupdate

router.put('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      msg: 'Invalid ID',
    });
  }
  if (!req.body.text) {
    return res.status(400).json({ message: 'Invalid Syntax' });
  }
  Comment.findByIdAndUpdate(req.params.id, { text: req.body.text })
    .then(comment => (comment ? Comment.find() : res.status(404).json({ message: 'Invalid ID' })))
    .then(comments =>
      res.status(201).json({
        message: 'Comment successfully updated',
        comments,
      })
    );
  // if (
  //   !db
  //     .get('comments')
  //     .find({
  //       id: req.params.id,
  //     })
  //     .value()
  // ) {
  //   return res.status(404).json({
  //     msg: 'Invalid ID',
  //   });
  // }

  // db.get('comments')
  //   .find({
  //     id: req.params.id,
  //   })
  //   .assign({
  //     text: req.body.text,
  //   })
  //   .write();
  // res.status(201).json({
  //   msg: 'Comment successfully updated',
  //   comments: db.get('comments').value(),
  // });
});

// return all the comments (make sure the new comment is included)

// BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.

// findbyIdandDelete
router.delete('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      msg: 'Invalid ID',
    });
  }
  Comment.findByIdAndDelete(req.params.id)
    .then(comment => (comment ? Comment.find() : res.status(404).json({ message: 'Invalid ID' })))
    .then(comments =>
      res.status(200).json({
        message: 'Comment successfully deleted',
        comments,
      })
    );

  // if (
  //   !db
  //     .get('comments')
  //     .find({
  //       id: req.params.id,
  //     })
  //     .value()
  // ) {
  //   return res.status(404).json({
  //     msg: 'Invalid ID',
  //   });
  // }
  // db.get('comments')
  //   .remove({
  //     id: req.params.id,
  //   })
  //   .write();
  // res.status(200).json({
  //   msg: 'Comment Succesfully deleted',
  //   comments: db.get('comments').value(),
  // });
});

module.exports = router;
