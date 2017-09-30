import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp);
chai.should();

var host = "http://0.0.0.0:3000/api"
var patch = "/patch"
var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWwiLCJwYXNzd29yZCI6Imhkc2ZkcyIsImlhdCI6MTUwNjc2NTU2NX0.G_6G_14L7dvUSxuf8qWrdlTnHQFTgxvt4t7iY6oIpmo"
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
    it("it should return patch json if correct data given", function () {
        chai.request(host).post(patch).send(jsonPatch).set("Authorization", token).end(function (err, res) {
                res.should.have.status(200)
                res.body.should.have.property("patchDocument");
                done();
        })
    });

})