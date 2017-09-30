'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app.js');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
_chai2.default.should();

//##############################################################################################
//TEST CASE FOR JSAON-PATCHING

var patch = "/api/patch";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM";
var jsonPatch = {
    "jsonObject": {
        "baz": "qux",
        "foo": "bar"
    },
    "Patch": [{ "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello", "value": ["world"] }, { "op": "remove", "path": "/foo" }]
};

(0, _mocha.describe)("json-Patch", function () {
    (0, _mocha.it)("it should return patched json if correct data given", function () {
        _chai2.default.request(_app2.default).post(patch).send(jsonPatch).set("Authorization", token).end(function (err, res) {
            if (err) {
                done(err);
            } else {
                res.should.have.status(200);
                res.body.should.have.property("patchDocument");
                done();
            }
        });
    });
    (0, _mocha.it)("it should not authenticate if token is invalid", function () {
        var invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc5MTYzMn0.x1oCejqbDVv_xnmqKTdMoMNMzKyV_qqWpjekCqsgLtM";
        _chai2.default.request(_app2.default).post(patch).send(jsonPatch).set("Authorization", invalidToken).end(function (err, res) {
            if (err) done(err);else {
                res.should.have.status(403);
                res.body.should.have.property("message");
                done();
            }
        });
    });
    (0, _mocha.it)("it should not authenticate if token is not given", function () {
        _chai2.default.request(_app2.default).post(patch).send(jsonPatch).end(function (err, res) {
            if (err) done(err);else {
                res.should.have.status(403);
                res.body.should.have.property("message");
                done();
            }
        });
    });
    (0, _mocha.it)("it should return error if wrong patch operation is given", function () {
        var jsonPatch = {
            "jsonObject": {
                "baz": "qux",
                "foo": "bar"
            },
            "Patch": [{ "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello", "value": ["world"] }, { "op": "remove" }]
        };
        _chai2.default.request(_app2.default).post(patch).send(jsonPatch).set("Authorization", token).end(function (err, res) {
            if (err) {
                done(err);
            } else {
                res.should.have.status(400);
                res.body.should.have.property("message");
                done();
            }
        });
    });
    (0, _mocha.it)("It should return error if patch operation is not provided", function () {
        var jsonPatch = {
            "jsonObject": {
                "baz": "qux",
                "foo": "bar"
            } };
        _chai2.default.request(_app2.default).post(patch).send(jsonPatch).set("Authorization", token).end(function (err, res) {
            if (err) {
                done(err);
            } else {
                res.should.have.status(400);
                res.body.should.have.property("message");
                done();
            }
        });
    });
});
//############################################################################################################

// TEST CASE FOR THUMBNAIL_GENERATIONS

//############################################################################################################