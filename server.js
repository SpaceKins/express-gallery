var express = require('express');
var app = express();
var pug = require('pug');
var path = require('path');
var bodyParser = require('body-parser');

var Gallery = require('./gallery.js');


var session = require('express-session');
var redis = require('connect-redis');
var RedisStore = redis(session);

var passport = require('passport');
var db = require('./models');

var CONFIG = require('./config');
var routesConfig = require('./configRoutes');

var LocalStrategy = require('passport-local'); //.Strategy;

//console.log(LocalStrategy);

var Photo = db.Photo;
var User = db.User;

var querystring = require('querystring');

var galleries = require('./routes/galleries')(express, app, querystring, bodyParser, passport, LocalStrategy);

var visitorCount = 0;
app.set('views', path.resolve(__dirname, 'views')); //'./views');
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'pug');
// Set after declaration.  for cleaner code //
app.use(bodyParser.urlencoded({
    extended: false
}));

console.log(routesConfig);

/************************ Passport ****************************************/

/*
var user = {
    username: 'bob',
    password: 'secret',
    email: 'bob@example.com'
};

*/


passport.serializeUser(function(user, done) {
    /*** writing to session storage, cookie and header is set 
    Only called when return done(null, thisUser); in Local Strategy ***/
    console.log('serialize');
    done(null, user.dataValues.id);
});


passport.deserializeUser(function(userId, done) {
    /*  also cretes req.user on req */
    console.log('deserializeUser');

    User.findById(userId)
        .then(function(thisUser) {
            if (thisUser) {
                return done(null, thisUser);
            }

            return done(null, false);
        })
        .catch(function(err) {
            return done(err);
        })

});


//**** Configures session ***********/
app.use(session({
    store: new RedisStore(),
    secret: CONFIG.SESSION.secret,
    saveUninitialized: false,
    resave: true
}));


app.use(function(req, res, next) {
    console.log('Thhis is the url ' + req.url);
    next();
});



app.use(passport.initialize());
/**** passport initialize sets methods to req like user, isAuthenticated  *****/

app.use(passport.session()); /******** Sets passport sessionn *************/
passport.use(new LocalStrategy(

    function(username, password, done) {
        //var isAuthenticated=authenticate(username,password);
        console.log('****************************');
        console.log('username=' + username + '|' + password);
        User.findOne({
            where: {
                username: username,
                password: password
            }
        })
            .then(function(thisUser) {
                console.log('============== In Then ========================');
                console.log('**********************User**************************************');
                console.log('SECRET STRING====');
                console.log(CONFIG.SESSION);
                console.log(thisUser);

                console.log('------------- Checkin thisUser --------------');
                if (thisUser) {
                    console.log(thisUser);
                    return done(null, thisUser);
                }

                console.log("No Found");
                return done(null, false);

            })
    }
));


app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);


app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/logout', function(req, res) {
    req.logout();
    res.render('login');
})


app.use(isAuthenticated, function(req, res, next) {
    console.log('^&&&&&&&& APP.USER &&&&&&&**');

    next();
    /*
  Photo.findAll()
    .then(function(photos){
      res.render('galleries',{
        galleryList:photos
      })
    })
   */
})



app.get('/secret', function(req, res) {
    res.render('secret');
})


/*****************************************************************************/



app.use('/gallery', galleries);

var galleryList = Gallery.getGalleryPhotos();

console.log(Gallery.currentGalleries);

//app.use(express.static('public'));

/****************  test Regex ***********************
var regEx = /^\/[0-9]/;
regEx = /^\/\d/;
regEx = /\/\d+\/edit/; //  /\/d+\/edit/
var toSearch = "/31/edit";

console.log(toSearch.search(regEx));
******************************************************/

app.get('/', isAuthenticated,
    function(req, res) {
        Photo.findAll()
            .then(function(photos) {
                //  res.json(photos);
                res.render('galleries', {
                    galleryList: photos
                })
            });
    })

/************* This is an example ***********/
app.get('/', function(req, res) {
    res.render('index', {
        visitorCount: visitorCount++
    });
})


app.use(function(req, res) {
    res.status(404).send("Cant' find page(" + req.url + ")");
})



db.sequelize.sync()
    .then(function() {
        app.listen(3000, function() {
            console.log('Listining on port 3000');
        })
    })
    .catch(function(err) {
        console.log(err.toString());
    });



function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log("isAuthenticated login");
        return res.redirect('/login');
    }
    return next();
}