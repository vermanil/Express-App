import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

// i will use "should" style assertions
chai.should();

var host = "http://localhost:3000";
describe("User Login", function () {
   it("It should return the token of username and password", function () {
        var path = "/login"
       chai.request(host).post(path).send({username:"me", password:"123"}).end(function (err, res) {
           res.should.have.status(200)
           res.body.should.have.property('token')
           done()
       });
   });
    it("It should return error if username does not exist", function () {
        var path = "/login";

    })
});
