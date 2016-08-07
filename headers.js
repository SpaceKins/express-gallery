var express = require('express');
var app = express();
var pug = require('pug');
var path = require('path');
var galleries = require('./routes/galleries');
var Gallery = require('./gallery.js');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var db = require('./models');

var CONFIG = require('./config');
var LocalStrategy = require('passport-local').Strategy;

var Photo = db.Photo;
var User = db.User;