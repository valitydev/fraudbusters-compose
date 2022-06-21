const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const config = require("../config");
const templateService = require("./service/template_service.js");
const inspectorService = require("./service/inspector_service.js");
const listsService = require("./service/wb_list_service.js");
const paymentService = require("./service/payment_service.js");

const FB_MGMNT_URL = config.fbManagement.url;

const GROUP_PATH = config.fbManagement.groupPath;

const testTimeout = config.testTimeout;
const IN_WHITE_lIST_TEMPLATE_ID = "white-list-template-id";
const IN_GREY_LIST_TEMPLATE_ID = "grey-list-template-id";
const IN_BLACK_LIST_TEMPLATE_ID = "black-list-template-id";
const GROUP_REFERENCE_ID = "test-wb-ref-id";
const SHOP_ID = "shop-wb-id";
const PARTY_ID = "party-wb-id";
const GROUP_ID = "group_id";
const IN_WHITE_LIST_TEMPLATE = "rule: inWhiteList(\"email\") -> accept;";
const IN_GREY_LIST_TEMPLATE = "rule: inGreyList(\"card_token\") -> accept;";
const IN_BLACK_LIST_TEMPLATE = "rule: inBlackList(\"card_token\") -> decline;"
const CARD_TOKEN = "wb_test_token_";

function generateCardToken() {
    return CARD_TOKEN + Math.floor(Math.random() * 999);
}

const EMAIL = "test@mail.ru" + Math.floor(Math.random() * 999);

function getNowDatePlusOneDay() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

describe('Test for check white, black and grey tokens', function () {
    this.timeout(testTimeout);

    it('it should create a new white list template', function (done) {
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
                res.body.id.should.equal(IN_WHITE_lIST_TEMPLATE_ID);
                res.body.template.should.equal(IN_WHITE_LIST_TEMPLATE);
            },
            IN_WHITE_LIST_TEMPLATE,
            IN_WHITE_lIST_TEMPLATE_ID);
    });

    it('it should create a new grey list template', function (done) {
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
                res.body.id.should.equal(IN_GREY_LIST_TEMPLATE_ID);
                res.body.template.should.equal(IN_GREY_LIST_TEMPLATE);
            },
            IN_GREY_LIST_TEMPLATE,
            IN_GREY_LIST_TEMPLATE_ID);
    });

    it('it should create a new black list template', function (done) {
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
                res.body.id.should.equal(IN_BLACK_LIST_TEMPLATE_ID);
                res.body.template.should.equal(IN_BLACK_LIST_TEMPLATE);
            },
            IN_BLACK_LIST_TEMPLATE,
            IN_BLACK_LIST_TEMPLATE_ID);
    });

    it('it should create a new group for list templates', function (done) {
        let TEST_GROUP = {
            groupId: GROUP_ID,
            modifiedByUser: "test-user",
            priorityTemplates: [
                {
                    id: IN_WHITE_lIST_TEMPLATE_ID,
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 0
                },
                {
                    id: IN_GREY_LIST_TEMPLATE_ID,
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 2
                },
                {
                    id: IN_BLACK_LIST_TEMPLATE_ID,
                    lastUpdateTime: "2019-08-24T14:15:22Z",
                    priority: 1
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
            id: GROUP_REFERENCE_ID,
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

    it('it should inspect that payment have HIGH risk by default result', function (done) {
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

    it('it should create a new row in list white', function (done) {
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

    it('it should inspect that payment have LOW risk by white list template', function (done) {
        setTimeout(() => inspectorService.inspectPayment(done,
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
                1000),
            10000);

    });


    it('it should create a new row in grey list', function (done) {
        listsService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.length.should.be.eql(1);
            },
            "grey",
            "CARD_TOKEN",
            PARTY_ID,
            SHOP_ID,
            cardToken,
            {
                "count": 0,
                "endCountTime": getNowDatePlusOneDay().toJSON(),
                "startCountTime": (new Date()).toJSON()
            });
    });

    it('it should inspect that payment have LOW risk by grey list template, first gery list attempt', function (done) {
        setTimeout(() => inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('low');
            },
            EMAIL + 'x',
            "123.123.123.123",
            "xxxxx",
            cardToken,
            PARTY_ID,
            SHOP_ID,
            1000), 10000);
    });

    it('it should upload payment to history for test grey list', function (done) {
        paymentService.uploadPayment(done,
            (res) => {
                res.should.have.status(201);
            },
            "captured",
            EMAIL + 'x',
            "123.123.123.123",
            cardToken,
            "xxxxx",
            PARTY_ID,
            SHOP_ID,
            "invoice_id_1.1");
    });

    it('it should create a new row in black list', function (done) {
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

    it('it should inspect that payment have FATAL risk by black list template', function (done) {
        setTimeout(() => inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('fatal');
            },
            EMAIL + 'x',
            "123.123.123.123",
            "xxxxx",
            cardToken,
            PARTY_ID,
            SHOP_ID,
            1000), 10000);
    });

});
