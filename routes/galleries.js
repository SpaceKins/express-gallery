var express = require('express');
var app = express();
var router = express.Router();
var querystring = require('querystring');
var bodyParser = require('body-parser');
var Gallery = require('./../gallery.js');

var db = require('./../models');
var Photo = db.Photo;

router.post('/', function(req, res) {
    //req.encoding('utf-8');
    //
    var body = req.body;
    Photo.create({
        link: body.link,
        author: body.author,
        description: body.description
    })
        .then(function(photo) {
            // console.log(body);
            // Gallery.createGalleryPhoto(body);
            res.send(body.description + ' Will be add to Gallery!');
        });
})

router.route('/new')
    .get(function(req, res) {
        res.render('galleryForm', {
            methodType: 'POST',
            actionType: '/gallery',
            formTitle: 'Create New Gallery'
        });
        //res.send('GET new Photo Form');
    })

/*
router.post('/:id',function(req,res){
  res.send(req.url);
});
*/

var id;

app.all(/\/\d+$/,function(req,res,next){
    console.log("*************Set Variables **********");
    next();
})




router.route(/\/\d+$/) //router.route('/:id')
.get(function(req, res) {
    var id = cleanParam(req.url);
    var thisPhoto;

    Photo.findById(id)
        .then(function(photo) {

            var thisGalleryArray = [];

            if (photo == null) {
                console.log('No photo by that name');
            } else {
                thisGalleryArray.push(photo);
            }

            res.render('gallery', {
                'galleryList': thisGalleryArray
            });
            //res.send('Get in Gallery id' + cleanParam(req.url));

        })
})
    .delete(function(req, res) {
        var id = cleanParam(req.url);
        Photo.destroy({
            where: {
                id: id
            }
        })
            .then(function() {
                //Gallery.deleteGalleryPhotoById(id);
                res.send('DELETE in Gallery id ' + cleanParam(req.url));
            });
    })
    .put(function(req, res) {
        var id = cleanParam(req.url);
        var body = req.body;

        console.log('In PUT for ' + id);
        Photo.update({
            link: body.link,
            author: body.author,
            description: body.description
        }, {
            where: {
                id: id
            }
        })
            .then(function() {
                Gallery.updateGalleryPhotoById(id, req.body);
                res.send('PUT in Gallery id ' + cleanParam(req.url));
            });
    })

router.route(/\/\d+\/edit/) //  /\/d+\/edit/
.get(function(req, res) {
    console.log('In Get Route' + req.url);
    var thisId = cleanParam(req.url.replace('/edit', ''));
    var thisGalleryPhoto = Gallery.getGalleryPhotoById(thisId);

    console.log('test');
    console.log(thisGalleryPhoto);
    res.render('galleryForm', {
        methodType: 'PUT',
        actionType: '/gallery/id',
        idValue: thisId,
        authorValue: thisGalleryPhoto.author,
        linkValue: thisGalleryPhoto.link,
        "descriptionValue": thisGalleryPhoto.description,
        formTitle: "Update Gallery"
    });
    //res.send('in ' + req.url);

    /*
        get gallery by id
        if exist
        populate form and server back
        if not respond with no gallery with this id
         */

})

function cleanParam(thisParam) {
    var paramArray = thisParam.split('/');
    return paramArray[paramArray.length - 1];
}

module.exports = router;