const chai = require("chai");
const config = require("../../config");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

const REFERENCE_PATH = config.fbManagement.referencePath;
const FB_MGMNT_URL = config.fbManagement.url;

module.exports.create = function (done, partyId, shopId, templateId) {
    let TEST_REFERENCES = [
        {
            id: "ref_" + Math.floor(Math.random() * 10000),
            lastUpdateDate: "2022-04-15T10:30:30",
            modifiedByUser: "test-user",
            shopId: shopId,
            partyId: partyId,
            templateId: templateId
        }
    ];

    chai.request(FB_MGMNT_URL)
        .post(REFERENCE_PATH)
        .send(TEST_REFERENCES)
        .end(function (err, res) {
            if (err) {
                console.log(err.text);
                done(err);
            }
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("array");
            res.body.length.should.be.eql(1);
            res.body.should.does.include(TEST_REFERENCES[0].partyId + "_" + TEST_REFERENCES[0].shopId);
            done()
        });
}