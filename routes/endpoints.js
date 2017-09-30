import express from 'express';
var router = express.Router();
import { apply_patch } from 'jsonpatch';
import request from 'request';
import { resolve, join } from 'path';
import { readFileSync, createWriteStream, writeHead } from 'fs'
import { thumbnailSize } from '../imgutils/resize.js';
import { verify } from "jsonwebtoken"

//It is using to validate the api
router.use('/', function(req, res, next) {
    // decode token
    var token = req.headers.authorization;
    if (token) {
        // verifies secret and checks exp
        verify(token, "anil", function(err, decoded) {
            if (err) {
                return res.status(403).send({message:'Not authenticated'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});



// Api to apply json patch to json object
router.post('/patch', function (req, res, next) {
  if(typeof req.body.jsonObject == 'undefined') {
      let err = new Error()
    err.statusCode = 400;
    err.message = "missing jsonObject";
      next(err);
  }
  else if (typeof req.body.Patch == 'undefined') {
      let err = new Error()
      err.statusCode = 400;
      err.message = "missing patch operations";
      next(err);
  }
  else {
    var jsonObject = req.body.jsonObject;
    var operation = req.body.Patch;
    var patchDocument = apply_patch(jsonObject, operation);
      res.statusCode = 200
      res.json(patchDocument);
  }
});



// Create thumbnail of image
router.post('/thumbnail', function (req, res, next) {
      if( req.query.imageUrl != 'undefined' || req.query.imageUrl != '' )
      {
        var imageUrl = req.query.imageUrl;
        request.get(imageUrl, function (err, response, body) {
            if(err){
                next(err);
            }
            else{
                var contentType = response.headers['content-type'].substring(0,5);
                var imgFormat = response.headers['content-type'].substring(6);
                var date = response.headers['date'].split(" ").join("_");
                // console.log(contentType);
                if(response.statusCode === 200 && contentType === 'image')
                {
                    if(response.headers['content-length'] <= 10 * 1024 * 1024)
                    {
                        const imgLocation = resolve(join(baseDirectory, 'img')) + '/original_' + date + '.' + imgFormat;
                        const thumbnailLocation = resolve(join(baseDirectory, 'img')) + '/thumbnail_' + date + '.' + imgFormat;
                        var stream = request.get(imageUrl).pipe(createWriteStream(imgLocation));
                        stream.on('finish', () => {
                            thumbnailSize(imgLocation, thumbnailLocation, (err, out) =>{
                                if(err) {
                                    next(err);
                                }
                                else{
                                    res.writeHead(200, {'content-type': response.headers['content-type'], 'Connection': 'close'})
                                    res.end(readFileSync(thumbnailLocation), 'binary')
                                }
                            })
                        });
                    }
                    else {
                        var err = new err("Image exceeds than 10 MB");
                        err.statusCode(400);
                        next(err);
                    }
                }
                else {
                    var err = new err("Image Not Found");
                    err.statusCode(400);
                    next(err);
                }
            }
        });
      }
      else{
        var err = new err("Url Not Found");
        err.statusCode(400);
          next(err);
      }
});

module.exports = router;
