var express = require('express');
var app = express();
var pug = require('pug');
var path = require('path');
var galleries = require('./routes/galleries');
var Gallery = require('./gallery.js');
var bodyParser = require('body-parser');

var db = require('./models');
var Photo = db.Photo;

var visitorCount = 0;
app.set('views', path.resolve(__dirname, 'views')); //'./views');
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'pug');
// Set after declaration.  for cleaner code //
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/gallery', galleries);

var galleryList = Gallery.getGalleryPhotos();

console.log(Gallery.currentGalleries);

//app.use(express.static('public'));

var regEx = /^\/[0-9]/;
regEx = /^\/\d/;
regEx = /\/\d+\/edit/; //  /\/d+\/edit/
var toSearch = "/31/edit";

console.log(toSearch.search(regEx));



app.get('/', function(req, res) {
    Photo.findAll()
        .then(function(photos) {
          //  res.json(photos);
            res.render('galleries', {
                galleryList: photos
            })
        });

    /*
    res.render('galleries', {
        galleryList: galleryList
    })
  */
    // res.send('List all gallery photos');
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

/*
var server = app.listen(3000, function() {
    console.log('Listening on Port ' + server.address().port);
    //db.sequelize.sync();
})
*/