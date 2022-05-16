const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const config = require("../config");

const FB_MGMNT_URL = config.fbManagement.url;

const TEMPLATE_PATH = config.fbManagement.templatePath;
const GROUP_PATH = config.fbManagement.groupPath;

const testTimeout = config.testTimeout;
const templateId = "test-wb-templ-id";
const templateRefId = "test-wb-ref-id";
const shopId = "shop-wb-id";
const partyId = "party-wb-id";
const GROUP_ID = "group_1";

describe('Test for check white, black and grey tokens', function () {
    this.timeout(testTimeout);

    it.skip('it should create a new template_1', function (done) {
        let TEST_TEMPLATE = {
            id: templateId + "_1",
            lastUpdateDate: "2022-04-15T10:30:00",
            modifiedByUser: "test-user",
            template: "rule: " +
                "inWhiteList(\"email\")" +
                " -> accept;"
        };

        chai.request(FB_MGMNT_URL)
            .post(TEMPLATE_PATH)
            .send(TEST_TEMPLATE)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("id");
                res.body.id.should.equal(TEST_TEMPLATE.id);
                done()
            });
    });

    it.skip('it should create a new template_2', function (done) {
        let TEST_TEMPLATE = {
            id: templateId + "_2",
            lastUpdateDate: "2022-04-15T10:30:00",
            modifiedByUser: "test-user",
            template: "rule: " +
                "inGreyList(\"cardToken\") " +
                " -> accept;"
        };

        chai.request(FB_MGMNT_URL)
            .post(TEMPLATE_PATH)
            .send(TEST_TEMPLATE)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("id");
                res.body.id.should.equal(TEST_TEMPLATE.id);
                done()
            });
    });

    it.skip('it should create a new template_3', function (done) {
        let TEST_TEMPLATE = {
            id: templateId + "_3",
            lastUpdateDate: "2022-04-15T10:30:00",
            modifiedByUser: "test-user",
            template: "rule: " +
                "inBlackList(\"cardToken\")" +
                " -> decline;"
        };

        chai.request(FB_MGMNT_URL)
            .post(TEMPLATE_PATH)
            .send(TEST_TEMPLATE)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("id");
                res.body.id.should.equal(TEST_TEMPLATE.id);
                done()
            });
    });

    it.skip('it should create a new group for templates', function (done) {
        let TEST_GROUP = {
            groupId: GROUP_ID,
            modifiedByUser: "test-user",
            priorityTemplates: [
                {
                    id: templateId + "_1",
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 0
                },
                {
                    id: templateId + "_2",
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 1
                },
                {
                    id: templateId + "_3",
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 2
                }]
        };

        chai.request(FB_MGMNT_URL)
            .post(GROUP_PATH)
            .send(TEST_GROUP)
            .end(function (err) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }

                done();
            });
    });

    it.skip('it should create a new reference for group', function (done) {
        let TEST_GROUP = [{
            groupId: GROUP_ID,
            id: templateRefId,
            lastUpdateDate: "2022-04-15T10:30:30",
            modifiedByUser: "test-user",
            shopId: shopId,
            partyId: partyId,
            templateId: templateId
        }];

        chai.request(FB_MGMNT_URL)
            .post(GROUP_PATH + '/' + GROUP_ID + '/references')
            .send(TEST_GROUP)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                done()
            });
    });

});
