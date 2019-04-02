const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/login', async (req, res) => {
  // compare the passwords
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Invalid username and password' });
  }
  const user = await User.findOne({ username: req.body.username });

  // check to make sure the user exists
  if (!user) return res.status(404).json({ message: 'Invalid username!' });

  // compare the passwords
  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (isMatch) {
    // sign a jwt
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    return res.json({ message: 'Successfully logged in', token: `Bearer ${token}` });
  }
  return res.status(401).json({ message: 'Invalid username and password!' });
});

module.exports = router;
