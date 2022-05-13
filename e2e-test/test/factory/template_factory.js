const chai = require("chai");
const config = require("../../config");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

const TEMPLATE_PATH = config.fbManagement.templatePath;
const FB_MGMNT_URL = config.fbManagement.url;

module.exports.create = function (done, template, id) {

    let TEST_TEMPLATE = {
        id: id,
        lastUpdateDate: "2022-04-15T10:30:00",
        modifiedByUser: "test-user",
        template: template
    };

    chai.request(FB_MGMNT_URL)
        .post(TEMPLATE_PATH)
        .send(TEST_TEMPLATE)
        .end(function (err, res) {
            if (err) {
                console.log(err.text);
                console.log(res);
                done(err);
            }
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("id");
            res.body.should.have.property("template");
            should.not.exist(res.body.errors)
            res.body.id.should.not.be.null;
            res.body.template.should.not.be.null;
            res.body.id.should.equal(TEST_TEMPLATE.id);
            res.body.template.should.equal(TEST_TEMPLATE.template);
            done()
        });
}