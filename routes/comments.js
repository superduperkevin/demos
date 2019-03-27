const express = require('express');
const moment = require('moment');
const shortid = require('shortid');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const commentData = require('../data');
const Comment = require('../models/comment.model');

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
  const myComment = db
    .get('comments')
    .find({
      id: req.params.id,
    })
    .value();
  if (myComment) {
    res.json(myComment);
  } else {
    res.status(404).json({
      msg: 'Invalid ID',
    });
  }
});

// create a comment
router.post('/', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      msg: 'Invalid syntax: please provide comment text',
    });
  }
  //   }
  //   // create a new comment with the text
  //   // timestamp: moment()
  const newComment = {
    text: req.body.text,
    id: shortid.generate(),
    timestamp: moment().format(),
  };

  //   // for id: https://github.com/dylang/shortid

  //   // add it to commentdata

  db.get('comments')
    .push(newComment)
    .write();
  //   // return all the comments (make sure the new comment is included)
  res.status(201).json({
    msg: 'Comment successfully added',
    comments: db.get('comments').value(),
  });
  //   // BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.
});

// updates a comment
router.put('/:id', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      msg: 'Invalid syntax: please provide text',
    });
  }

  if (
    !db
      .get('comments')
      .find({
        id: req.params.id,
      })
      .value()
  ) {
    return res.status(404).json({
      msg: 'Invalid ID',
    });
  }

  db.get('comments')
    .find({
      id: req.params.id,
    })
    .assign({
      text: req.body.text,
    })
    .write();
  res.status(201).json({
    msg: 'Comment successfully updated',
    comments: db.get('comments').value(),
  });
});

// return all the comments (make sure the new comment is included)

// BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.
router.delete('/:id', (req, res) => {
  if (
    !db
      .get('comments')
      .find({
        id: req.params.id,
      })
      .value()
  ) {
    return res.status(404).json({
      msg: 'Invalid ID',
    });
  }
  db.get('comments')
    .remove({
      id: req.params.id,
    })
    .write();

  res.status(200).json({
    msg: 'Comment Succesfully deleted',
    comments: db.get('comments').value(),
  });
});

module.exports = router;
