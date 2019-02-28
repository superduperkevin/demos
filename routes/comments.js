const express = require('express');
const moment = require('moment');
const shortid = require('shortid');
const commentData = require('../data');

const router = express.Router();

// get all comments
router.get('/', (req, res) => {
  res.json(commentData);
});
// get a single comment by id
router.get('/:id', (req, res) => {
  const myComment = commentData.find(comment => comment.id === parseInt(req.params.id));
  if (myComment) {
    res.json(myComment);
  } else {
    res.status(404).json({
      msg: 'Invalid ID',
    });
  }
});

// create a comment
// router.post('/', (req, res) => {
//   if (!req.body.text) {
//     res.status(400).json({
//       msg: 'Invalid syntax: please provide comment text',
//     });
//   }
//   // create a new comment with the text
//   // timestamp: moment()
//   const newComment = {
//     text: req.body.text,
//     id: shortid.generate(),
//     timestamp: moment().format(),
//   };

//   // for id: https://github.com/dylang/shortid

//   // add it to commentdata

//   commentData.push(newComment);

//   // return all the comments (make sure the new comment is included)
//   res.status(201).json({
//     msg: 'Comment successfully added',
//     comments: commentData,
//   });
//   // BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.
// });

// updates a comment
router.put('/:id', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      msg: 'Invalid syntax: please provide text',
    });
  }
  const myComment = commentData.find(comment => comment.id === parseInt(req.params.id));

  if (myComment) {
    const indexComment = commentData.indexOf(myComment);

    const newComment = {
      text: req.body.text,
      id: parseInt(req.params.id),
      timestamp: moment().format(),
    };
  }
  // return all the comments (make sure the new comment is included)
  res.status(201).json({
    msg: 'Comment successfully updated',
    comments: commentData,
  });
  // BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.
});
router.delete('/:id', (req, res) => {
  const deleteID = commentData.findIndex(comment => comment.id === parseInt(req.params.id));
  if (deleteID < 0) {
    res.status(400).json({
      msg: 'Invalid syntax: please exsisting ID',
    });
  }
  // create a new comment with the text
  // timestamp: moment()
  // delete from commentdata
  commentData.splice(deleteID, 1);
  // return all the comments (make sure the new comment is included)
  res.status(201).json({
    msg: 'Comment successfully deleted',
    comments: commentData,
  });
  // BONUS: if request has no body text (or text is empty), send proper error code and maybe a message.
});

module.exports = router;
