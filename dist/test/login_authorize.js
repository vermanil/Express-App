'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

// i will use "should" style assertions
_chai2.default.should();

var host = "http://localhost:3000";
(0, _mocha.describe)("User Login", function () {
    (0, _mocha.it)("It should return the token of username and password", function () {
        var path = "/login";
        _chai2.default.request(host).post(path).send({ username: "me", password: "123" }).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('token');
            done();
        });
    });
    (0, _mocha.it)("It should return error if username does not exist", function () {
        var path = "/login";
    });
});