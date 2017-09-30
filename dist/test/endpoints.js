'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
_chai2.default.should();

var host = "http://0.0.0.0:3000/api";
var patch = "/patch";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc2NTU2NX0.G_6G_14L7dvUSxuf8qWrdlTnHQFTgxvt4t7iY6oIpmo";
var jsonPatch = {
    "jsonObject": {
        "baz": "qux",
        "foo": "bar"
    },
    "Patch": [{ "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello", "value": ["world"] }, { "op": "remove", "path": "/foo" }]
};

(0, _mocha.describe)("json-Patch", function () {
    (0, _mocha.it)("it should return patch json if correct data given", function () {
        _chai2.default.request(host).post(patch).send(jsonPatch).set("Authorization", token).end(function (err, res) {
            if (err) next(err);else {
                res.should.have.status(200);
                res.body.should.have.property("patchDocument");
                done();
            }
        });
    });
});