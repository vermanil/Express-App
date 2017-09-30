import express from 'express'
import { apply_patch } from 'jsonpatch'
import { resolve, join } from 'path'
import { readFileSync, createWriteStream } from 'fs'
import { thumbnailSize } from '../imgutils/resize.js'
import { verify } from 'jsonwebtoken'
import request from 'request'
var router = express.Router()

/**
 * It authenticate json_patching and thumbnail_generation api
 * @name Api Authentications
 * @param {object} req contains headers
 * @param {object} res contains the decoded username and password
 * @param {function} next
 */

//###################################################################################
//                           API VALIDATIONS
//###################################################################################
router.use('/', function (req, res, next) {
    // decode token
  var token = req.headers.authorization
  if (token) {
        // verifies secret and checks exp
    verify(token, 'anil', function (err, decoded) {
      if (err) {
        return res.status(403).send({message: 'Not authenticated'})
      } else {
                // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})

//################################################################################

//                          API FOR JSON_PATCHING

//################################################################################

/**
 * Api to apply json patch on json object and Update json
 * @name Json-Patching
 * @param {object} req contains jsonObject and Patch
 * @param {object} res give patchedDocument op json
 * @param {function} next
 */

router.post('/patch', function (req, res, next) {
  if (typeof req.body.jsonObject === 'undefined') {
    res.statusCode = 400
    res.json({"message":'missing jsonObject'})
  } else if (typeof req.body.Patch === 'undefined') {
    res.statusCode = 400
    res.json({"message":'missing patch operations'})
  } else {
    var jsonObject = req.body.jsonObject
    var operation = req.body.Patch
    try {
      var patchDocument = apply_patch(jsonObject, operation)
      res.statusCode = 200
      res.json(patchDocument)
    }
    catch(e){
      res.statusCode = 400
      res.json({"message":"wrong patch operations"})
    }
  }
})

//####################################################################################

//                    API FOR THUMBNAIL_GENERATIONS

//####################################################################################
/**
 * Create thumbnail of image
 * @name Thumbnail-Generation
 * @param {object} req contains the url of image
 * @param {object} res gives the thumnail image of 50*50 size
 * @param {function} next
 */
//
router.post('/thumbnail', function (req, res, next) {
  if (req.query.imageUrl !== 'undefined' || req.query.imageUrl !== '') {
    var imageUrl = req.query.imageUrl
    request.get(imageUrl, function (err, response, body) {
      if (err) {
        next(err)
      } else {
        var contentType = response.headers['content-type'].substring(0, 5)
        var imgFormat = response.headers['content-type'].substring(6)
        var date = response.headers['date'].split(' ').join('_')
                // console.log(contentType);
        if (response.statusCode === 200 && contentType === 'image') {
          if (response.headers['content-length'] <= 10 * 1024 * 1024) {
            const originalLocation = resolve(join(baseDirectory, 'img')) + '/original_' + date + '.' + imgFormat
            const thumbnailLocation = resolve(join(baseDirectory, 'img')) + '/thumbnail_' + date + '.' + imgFormat
            var stream = request.get(imageUrl).pipe(createWriteStream(originalLocation))
            stream.on('finish', () => {
              thumbnailSize(originalLocation, thumbnailLocation, (err, out) => {
                if (err) {
                  next(err)
                } else {
                  res.writeHead(200, {'content-type': response.headers['content-type'], 'Connection': 'close'})
                  res.end(readFileSync(thumbnailLocation), 'binary')
                }
              })
            })
          } else {
            var error = new Error('Image exceeds than 10 MB')
            error.statusCode(400)
            next(error)
          }
        } else {
          var e = new Error('Image Not Found')
          e.statusCode(400)
          next(e)
        }
      }
    })
  } else {
    var er = new Error('Url Not Found')
    er.statusCode(400)
    next(er)
  }
})

module.exports = router
