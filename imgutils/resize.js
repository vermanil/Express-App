import jimp from 'jimp'

exports.thumbnailSize = (originalImagePath, thumbnailImageLocation, callback) => {
    jimp.read(originalImagePath, (error, image) =>  {
        if (error){
            let err = new Error();
            err.statusCode = 400;
            err.message = 'Wrong Image';
            callback(err, null)
        }
        else {
            image.resize(50, 50)
                .write(thumbnailImageLocation, (err) => {
                    if (err) {
                        callback(err, null)
                    }
                    callback(null, thumbnailImageLocation)
                });
        }
    });
};