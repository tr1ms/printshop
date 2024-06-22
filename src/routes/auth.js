const express = require("express");
const jwt = require("jsonwebtoken");
// const expressSession = require('express-session')
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("@controllers/user");
const User = require("@models/User");
const bcrypt = require("bcrypt");

const adminPassword = process.env.ADMIN_PASSWORD || "iamthewalrus";
// const sessionSecret = process.env.SESSION_SECRET || 'markitzero'
const jwtSecret = process.env.JWT_SECRET || "markitzero";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const isAdmin =
      username.toLowerCase() == "admin" && password == adminPassword;
    if (isAdmin) return done(null, { username: "admin", email: "" });
    const user = await User.get(username);
    const isUser = user && (await bcrypt.compare(password, user.password));
    if (isUser)
      return done(null, { username: user.username, email: user.email });
    return done(null, false);
  }),
);

// passport.serializeUser((user, done) => done(null, user))
// passport.deserializeUser((user, done) => done(null, user))

// router.use(expressSession({
// 	secret: sessionSecret,
// 	resave: false,
// 	saveUninitialized: false
// }))
// router.use(passport.session())

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = jwt.sign(req.user, jwtSecret, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES || "30d",
    });
    res.cookie("jwt", token, { httpOnly: true }).json({ success: true, token });
  },
);

router.post("/register", userController.createUser);

const isAuthenticated = (req, res, next) => {
  try {
    const error = new Error("unathorized");
    error.statusCode = 401;

    let token = req.cookies.jwt || req.headers.authorization;
    if (!token) return next(error);
    token = token.replace(/^Bearer /, "");

    const payload = jwt.verify(token, jwtSecret);
    const isAdmin = payload && payload.username == "admin";

    if (isAdmin) req.isAdmin = true;
    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};

const isAuthorized = (req, res, next) => {
  const error = new Error("forbidden");
  error.statusCode = 403;
  if (!req.isAdmin) return next(error);
  next();
};

module.exports = { auth: router, isAuthenticated, isAuthorized };
