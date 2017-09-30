'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonpatch = require('jsonpatch');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _fs = require('fs');

var _resize = require('../imgutils/resize.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Api to apply json patch to json object
router.post('/patch', function (req, res, next) {
    if (typeof req.body.jsonObject == 'undefined') {
        res.status(400);
        res.send("missing jsonObject");
    } else if (typeof req.body.Patch == 'undefined') {
        res.status(400);
        res.send("Missing json Patch");
    } else {
        // console.log(req.body.jsonObject);
        // console.log(req.body.Patch);
        var jsonObject = req.body.jsonObject;
        var operation = req.body.Patch;
        var patchDocument = (0, _jsonpatch.apply_patch)(jsonObject, operation);
        res.json(patchDocument);
    }
});

// Create thumbnail of image
router.post('/thumbnail', function (req, res, next) {
    if (req.query.imageUrl != 'undefined' || req.query.imageUrl != '') {
        var imageUrl = req.query.imageUrl;
        _request2.default.get(imageUrl, function (err, response, body) {
            if (err) {
                next(err);
            } else {
                var contentType = response.headers['content-type'].substring(0, 5);
                var imgFormat = response.headers['content-type'].substring(6);
                var date = response.headers['date'].split(" ").join("_");
                // console.log(contentType);
                if (response.statusCode === 200 && contentType === 'image') {
                    if (response.headers['content-length'] <= 10 * 1024 * 1024) {
                        var imgLocation = (0, _path.resolve)((0, _path.join)(baseDirectory, 'img')) + '/original_' + date + '.' + imgFormat;
                        var thumbnailLocation = (0, _path.resolve)((0, _path.join)(baseDirectory, 'img')) + '/thumbnail_' + date + '.' + imgFormat;
                        var stream = _request2.default.get(imageUrl).pipe((0, _fs.createWriteStream)(imgLocation));
                        stream.on('finish', function () {
                            (0, _resize.thumbnailSize)(imgLocation, thumbnailLocation, function (err, out) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.writeHead(200, { 'content-type': response.headers['content-type'], 'Connection': 'close' });
                                    res.end((0, _fs.readFileSync)(thumbnailLocation), 'binary');
                                }
                            });
                        });
                    } else {
                        var err = new err("Image exceeds than 10 MB");
                        err.statusCode(400);
                        next(err);
                    }
                } else {
                    var err = new err("Image Not Found");
                    err.statusCode(400);
                    next(err);
                }
            }
        });
    } else {
        var err = new err("Url Not Found");
        err.statusCode(400);
        next(err);
    }
});

module.exports = router;