import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../app.js'
chai.use(chaiHttp)

// i will use "should" style assertions
chai.should();

var login = "/login"

describe('Invalid routes', function() {
    it('should return error', function(done) {
        chai.request(server)
            .post('/')
            .end( function(err, res) {
                res.should.have.status(404)
                done()
            })
    })
})

describe("User Login", function () {
   it("It should return the token of username and password", function (done) {
       chai.request(server).post(login).send({"username":"me", "password":"123"}).end( function (err, res) {
           res.should.have.status(200)
           res.body.should.have.property('token')
           done()
       });
   });
    it("It should return error if username property does not exist", function (done) {
        chai.request(server).post(login).send({"password":"123"}).end( function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done()
        });
    });
    it("it should return error if password property does not exists", function (done) {
        chai.request(server).post(login).send({"username":"me"}).end( function (err, res) {
            res.should.have.status(400)
            res.body.should.have.property('message')
            done()
        })
    })
});

