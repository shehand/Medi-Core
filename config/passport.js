var passport = require('passport');
var localStratergy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, done) {
   done(null, user.id);
});
