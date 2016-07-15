var express = require('express');
var app=express();
var router = express.Router();
var querystring = require('querystring');
var bodyParser = require('body-parser');
var Gallery = require('./../gallery.js');

router.post('/', function(req, res) {
    //req.encoding('utf-8');
    //
        var body = req.body;
        console.log('*****************');
        console.log(body);
        console.log('*****************');
        Gallery.createGalleryPhoto(body);
        res.send(body.description + ' Will be add to Gallery!');
})

router.route('/new')
    .get(function(req, res) {
        res.render('galleryForm', {
            methodType: 'POST',
            actionType: '/gallery'
        });
        //res.send('GET new Photo Form');
    })


/*
router.post('/:id',function(req,res){
  res.send(req.url);
});
*/

router.route(/\/\d+$/) //router.route('/:id')
.get(function(req, res) {
    var id = cleanParam(req.url);
    var thisGallery = Gallery.getGalleryPhotoById(id);
    var thisGalleryArray = [];

    console.log('**&&&&&***********');
    console.log(thisGalleryArray);

    if (thisGallery.length != []) {
        thisGalleryArray = [thisGallery];
    }

    res.render('gallery', {
        'galleryList': thisGalleryArray
    });
    //res.send('Get in Gallery id' + cleanParam(req.url));
})
    .delete(function(req, res) {
        var id=cleanParam(req.url);

        Gallery.deleteGalleryPhotoById(id);
        res.send('DELETE in Gallery id ' + cleanParam(req.url));
    })
    .put(function(req, res) {
        var id=cleanParam(req.url);
        Gallery.updateGalleryPhotoById(id,req.body);
        res.send('PUT in Gallery id ' + cleanParam(req.url));
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
        "descriptionValue": thisGalleryPhoto.description
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