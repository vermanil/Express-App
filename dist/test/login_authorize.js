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

// i will use "should" style assertions
_chai2.default.should();

var login = "/login";
(0, _mocha.describe)("User Login", function () {
    (0, _mocha.it)("It should return the token of username and password", function () {
        _chai2.default.request(_app2.default).post(login).send({ "username": "me", "password": "123" }).end(function (err, res) {
            if (err) {
                console.log("hello");
                done(err);
            } else {
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
            }
        });
    });
    (0, _mocha.it)("It should return error if username property does not exist", function () {
        _chai2.default.request(_app2.default).post(login).send({ "password": "123" }).end(function (err, res) {
            if (err) done(err);else {
                res.should.have.status(400);
                res.body.should.have.property('message');
                done();
            }
        });
    });
    (0, _mocha.it)("it should return error if password property does not exists", function () {
        _chai2.default.request(_app2.default).post(login).send({ "username": "me" }).end(function (err, res) {
            if (err) done(err);else {
                res.should.have.status(400);
                res.body.should.have.property('message');
                done();
            }
        });
    });
});