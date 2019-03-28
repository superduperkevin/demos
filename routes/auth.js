const router = require('express').Router();
const User = require('../models/user.model');

router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Invalid syntax: please provide username and password' });
  }
  // req has a body with a username and password

  User.create({
    username: req.body.username,
    // TODO: more robust password hashing
    password: req.body.password,
  })
    .then(user => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json({ message: 'User successfully created', user: userObj });
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
