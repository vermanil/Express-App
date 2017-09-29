'use strict';

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.thumbnailSize = function (originalImagePath, thumbnailImageLocation, callback) {
    _jimp2.default.read(originalImagePath, function (error, image) {
        if (error) {
            var err = new Error();
            err.statusCode = 400;
            err.message = 'Broken image found';
            callback(err, null);
        } else {
            image.resize(50, 50).write(thumbnailImageLocation, function (err) {
                if (err) {
                    callback(err, null);
                }
                callback(null, thumbnailImageLocation);
            });
        }
    });
};