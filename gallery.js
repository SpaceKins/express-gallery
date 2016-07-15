var fs = require('fs');

module.exports = {
    currentGalleries: [],
    lastGalleryId: 0,
    jsonFile: './data/gallery.json',
    testJSONFile: './data/galleryTest.json'

    ,
    getGalleryPhotos: function() {
        console.log('In getGallerPhotos');
        var galleryObject = JSON.parse(fs.readFileSync('./data/gallery.json', 'utf-8'));
        var galleryList = galleryObject.galleries;
        this.lastGalleryId = galleryObject.lastId;
        console.log('Last Id=' + this.lastGalleryId);
        console.log(galleryList);
        console.log('Count=' + galleryList.length);
        this.currentGalleries = galleryList;
        return galleryList;
    }

    ,
    getGalleryPhotoById: function(thisId) {
        for (var i = 0; i < this.currentGalleries.length; i++) {
            console.log('*****************');
            console.log(this.currentGalleries[i].id + ' ' + thisId);
            if (this.currentGalleries[i].id == thisId) {
                return this.currentGalleries[i];
            }
        }
        return [];
    }

    ,
    createGalleryPhoto: function(galleryInfo) {
        console.log('Create Gallery ');
        console.log(galleryInfo);
        console.log('Current Galleries');
        console.log(this.currentGalleries);
        console.log('lastId');
        console.log(this.lastGalleryId);
        console.log(galleryInfo.link);

        galleryInfo.id = (++this.lastGalleryId);
        this.currentGalleries.push(galleryInfo);
        this.updateDataSource();
    }

    ,
    deleteGalleryPhotoById: function(thisId) {
        var index = -1;
        console.log(this.currentGalleries);

        for (var i = 0; i < this.currentGalleries.length; i++) {
            if (thisId == this.currentGalleries[i].id) {
                index++;
                break;
            }
        }

        if (index != -1) {
            console.log(this.currentGalleries);
            console.log('remove at index ' + index);
            this.currentGalleries.splice(index, 1);
            console.log(this.currentGalleries);
            this.updateDataSource();
        } else {
            console.log("can't find " + thisId);
        }

        return index;
    }

    ,
    updateGalleryPhotoById: function(thisId, galleryInfo) {
        var index = -1;
        console.log(galleryInfo);

        console.log('*******************');


        for (var i = 0; i < this.currentGalleries.length; i++) {
            if (thisId == this.currentGalleries[i].id) {
                this.currentGalleries[i].author = galleryInfo.author;
                this.currentGalleries[i].link = galleryInfo.link;
                this.currentGalleries[i].description = galleryInfo.description;
                index++;
                break;
            }
        }

        if (index != -1) {
            console.log(this.currentGalleries);
            console.log('updated at index ' + index);
            this.updateDataSource();
        } else {
            console.log("can't find " + thisId);
        }

        return index;
    }

    ,
    updateDataSource: function() {
        console.log('&&&&&&&&&&&&&&');
        console.log(this.currentGalleries);
        console.log('&&&&&&&&&&&&&&&');

        var galleryObject = {
            "lastId": this.lastGalleryId,
            "galleries": this.currentGalleries
        };

        fs.writeFile(this.testJSONFile, JSON.stringify(galleryObject), {
            encoding: 'utf8'
        }, function() {
            console.log('File has been Writen');
        })
    }
}