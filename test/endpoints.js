import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../app.js'
chai.use(chaiHttp);
chai.should();

//##############################################################################################
//TEST CASE FOR JSAON-PATCHING

var patch = "/api/patch"
var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM"
var jsonPatch = {
    "jsonObject":{
        "baz": "qux",
        "foo": "bar"
    },
    "Patch":[
        { "op": "replace", "path": "/baz", "value": "boo" },
        { "op": "add", "path": "/hello", "value": ["world"] },
        { "op": "remove", "path": "/foo"}
    ]
}

describe("json-Patch", function () {
    it("it should return patched json if correct data given", function () {
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
                if(err) {
                    done(err)
                }
                else {
                    res.should.have.status(200)
                    res.body.should.have.property("patchDocument");
                    done();
                }
        })
    });
    it("it should not authenticate if token is invalid", function () {
        let invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM"
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", invalidToken).end( function (err, res) {
            if(err)
                done(err)
            else{
                res.should.have.status(403)
                res.body.should.have.property("message")
                done()
            }
        })
    });
    it("it should not authenticate if token is not given", function () {
        chai.request(server).post(patch).send(jsonPatch).end( function (err, res) {
            if(err)
                done(err)
            else{
                res.should.have.status(403)
                res.body.should.have.property("message")
                done()
            }
        })
    });
    it("it should return error if wrong patch operation is given", function () {
        let jsonPatch = {
            "jsonObject":{
                "baz": "qux",
                "foo": "bar"
            },
            "Patch":[
                { "op": "replace", "path": "/baz", "value": "boo" },
                { "op": "add", "path": "/hello", "value": ["world"] },
                { "op": "remove"}
            ]
        }
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
            if(err) {
                done(err)
            }
            else {
                res.should.have.status(400)
                res.body.should.have.property("message");
                done();
            }
        })
    });
    it("It should return error if patch operation is not provided", function () {
        let jsonPatch = {
            "jsonObject":{
                "baz": "qux",
                "foo": "bar"
            }}
        chai.request(server).post(patch).send(jsonPatch).set("Authorization", token).end( function (err, res) {
            if(err) {
                done(err)
            }
            else {
                res.should.have.status(400)
                res.body.should.have.property("message");
                done();
            }
        })

    })

})
//############################################################################################################

// TEST CASE FOR THUMBNAIL_GENERATIONS

//############################################################################################################