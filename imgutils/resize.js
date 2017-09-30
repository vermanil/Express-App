import jimp from 'jimp'

exports.thumbnailSize = (originalImagePath, thumbnailImageLocation, callback) => {
  jimp.read(originalImagePath, (error, image) => {
    if (error) {
      callback(new Error('Wrong Image Found'), null, null)
    } else {
      image.resize(50, 50)
                .write(thumbnailImageLocation, (err) => {
                  if (err) {
                    callback(err, null, null)
                  }
                  callback(null, thumbnailImageLocation, null)
                })
    }
  })
}
