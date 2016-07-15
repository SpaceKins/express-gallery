var fs = require('fs');

module.exports = {
    currentGalleries:[]
    ,lastGalleryId:0

    ,getGalleryPhotos: function() {
        console.log('In getGallerPhotos');
        var galleryObject = JSON.parse(fs.readFileSync('./data/gallery.json', 'utf-8'));
        var galleryList  = galleryObject.galleries;
        this.lastGalleryId=galleryObject.lastId;
        console.log('Last Id='+ this.lastGalleryId);
        console.log(galleryList);
        console.log('Count=' + galleryList.length);
        this.currentGalleries=galleryList;
        return galleryList;
    }

    ,getGalleryPhotoById: function(thisId) {
        for (var i = 0; i < this.currentGalleries.length; i++) {
        console.log('*****************');
        console.log(this.currentGalleries[i].id + ' ' + thisId);
            if (this.currentGalleries[i].id == thisId) {
                return this.currentGalleries[i];
            }
        }
        return [];
    }

    ,deleteGalleryPhotoById: function(thisId){

    }

}