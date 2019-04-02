const passportjwt = require('passport-jwt');
const User = require('./models/user.model');

const { Strategy, ExtractJwt } = passportjwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

const JwtStrategy = new Strategy(options, async (req, payload, done) => {
  // find the associated user
  // and return that
  console.log(payload);
  try {
    const user = await User.findById(payload._id);
    req.user = user;
    done(null, user);
  } catch (err) {
    console.log('HERE');
    done(err, false);
  }
});

module.exports = JwtStrategy;
