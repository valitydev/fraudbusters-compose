const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const config = require("../config");
const templateService = require("./service/template_service.js");
const inspectorService = require("./service/inspector_service.js");
const listsService = require("./service/wb_list_service.js");

const FB_MGMNT_URL = config.fbManagement.url;

const GROUP_PATH = config.fbManagement.groupPath;

const testTimeout = config.testTimeout;
const TEMPLATE_ID_1 = "test-wb-templ-id_1";
const TEMPLATE_ID_2 = "test-wb-templ-id_2";
const TEMPLATE_ID_3 = "test-wb-templ-id_3";
const templateRefId = "test-wb-ref-id";
const SHOP_ID = "shop-wb-id";
const PARTY_ID = "party-wb-id";
const GROUP_ID = "group_1";
const TEMPLATE = "rule: inWhiteList(\"email\") -> accept;";
const TEMPLATE_2 = "rule: inGreyList(\"card_token\") -> accept;";
const TEMPLATE_3 = "rule: inBlackList(\"card_token\") -> decline;"
const CARD_TOKEN = "wb_test_token_";
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function generateCardToken() {
    return CARD_TOKEN + Math.floor(Math.random() * 999);
}

const EMAIL = "test@mail.ru" + Math.floor(Math.random() * 999);

describe('Test for check white, black and grey tokens', function () {
    this.timeout(testTimeout);

    it('it should create a new template_1', function (done) {
        templateService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("errors");
                res.body.should.have.property("id");
                res.body.should.have.property("template");
                res.body.id.should.not.be.null;
                res.body.template.should.not.be.null;
                res.body.id.should.equal(TEMPLATE_ID_1);
                res.body.template.should.equal(TEMPLATE);
            },
            TEMPLATE,
            TEMPLATE_ID_1);
    });

    it('it should create a new template_2', function (done) {
        templateService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("errors");
                res.body.should.have.property("id");
                res.body.should.have.property("template");
                res.body.id.should.not.be.null;
                res.body.template.should.not.be.null;
                res.body.id.should.equal(TEMPLATE_ID_2);
                res.body.template.should.equal(TEMPLATE_2);
            },
            TEMPLATE_2,
            TEMPLATE_ID_2);
    });

    it('it should create a new template_3', function (done) {
        templateService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("errors");
                res.body.should.have.property("id");
                res.body.should.have.property("template");
                res.body.id.should.not.be.null;
                res.body.template.should.not.be.null;
                res.body.id.should.equal(TEMPLATE_ID_3);
                res.body.template.should.equal(TEMPLATE_3);
            },
            TEMPLATE_3,
            TEMPLATE_ID_3);
    });

    it('it should create a new group for templates', function (done) {
        let TEST_GROUP = {
            groupId: GROUP_ID,
            modifiedByUser: "test-user",
            priorityTemplates: [
                {
                    id: TEMPLATE_ID_1,
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 0
                },
                {
                    id: TEMPLATE_ID_2,
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 1
                },
                {
                    id: TEMPLATE_ID_3,
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

    it('it should create a new reference for group', function (done) {
        let TEST_GROUP = [{
            groupId: GROUP_ID,
            id: templateRefId,
            lastUpdateDate: "2022-04-15T10:30:30",
            modifiedByUser: "test-user",
            shopId: SHOP_ID,
            partyId: PARTY_ID
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

    let cardToken = generateCardToken();

    it('it should inspect that payment have HIGH risk', function (done) {
        inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('high');
            },
            EMAIL,
            "123.123.123.123",
            "xxxxx",
            cardToken,
            PARTY_ID,
            SHOP_ID,
            1000);
    });

    it('it should create a new list row white', function (done) {
        listsService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.length.should.be.eql(1);
            },
            "white",
            "EMAIL",
            PARTY_ID,
            SHOP_ID,
            EMAIL);
    });

    it('it should inspect that payment have LOW risk', function (done) {
        sleep(10000);
        inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('low');
            },
            EMAIL,
            "123.123.123.123",
            "xxxxx",
            cardToken,
            PARTY_ID,
            SHOP_ID,
            1000);
    });

    it('it should create a new list row black', function (done) {
        listsService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.length.should.be.eql(1);
            },
            "black",
            "CARD_TOKEN",
            PARTY_ID,
            SHOP_ID,
            cardToken);
    });

    it('it should inspect that payment have FATAL risk', function (done) {
        sleep(10000);
        inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('fatal');
            },
            EMAIL,
            "123.123.123.123",
            "xxxxx",
            cardToken,
            PARTY_ID,
            SHOP_ID,
            1000);
    });

});
