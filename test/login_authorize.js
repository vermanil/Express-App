import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

// i will use "should" style assertions
chai.should();

var host = "http://localhost:3000";
var login = "/login"
describe("User Login", function () {
   it("It should return the token of username and password", function () {
       chai.request(host).post(login).send({username:"me", password:"123"}).end(function (err, res) {
           res.should.have.status(200)
           res.body.should.have.property('token')
           done()
       });
   });
    it("It should return error if username property does not exist", function () {
        chai.request(host).post(login).send({password:"123"}).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done()
        });
    });
    it("it should return error if password property does not exists", function () {
        chai.request(host).post(login).send({username:"me"}).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
        })
    })
});

