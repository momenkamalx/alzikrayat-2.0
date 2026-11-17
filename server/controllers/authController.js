const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (u) => ({
  id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
});

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hash });

    res.status(201).json({ success: true, message: 'Account created', user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password is hidden by default (select:false), so ask for it here
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(password, user.password));

    // same message for wrong email or wrong password (don't leak which)
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect' });
    }

    res.json({ success: true, token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected) - lets the client restore a session
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
