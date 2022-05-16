const referenceService = require('./service/reference_service.js');
const templateService = require('./service/template_service.js');

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const config = require("../config");
const inspectorService = require("./service/inspector_service.js");

const testTimeout = config.testTimeout;
const TEMPLATE_ID = "test-templ-id";

const TEMPLATE = "rule:amount_test:amount() >= 20 -> decline;";
const PARTY_ID = "partyTest";
const SHOP_ID = "shopTest";
describe('Test for simple rule inspection', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
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
                res.body.id.should.equal(TEMPLATE_ID);
                res.body.template.should.equal(TEMPLATE);
            }, TEMPLATE, TEMPLATE_ID);
    });

    it('it should create a new reference for template', function (done) {
        referenceService.create(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("array");
                res.body.length.should.be.eql(1);
                res.body.should.does.include(PARTY_ID + "_" + SHOP_ID);
            }, PARTY_ID, SHOP_ID, TEMPLATE_ID);
    });

    it('it should inspect that payment have FATAL risk', function (done) {
        inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('fatal');
            },
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            "4J8vmnlYPwzYzia74fny81",
            PARTY_ID,
            SHOP_ID,
            100);
    });

    it('it should inspect that payment have default HIGH risk', function (done) {
        inspectorService.inspectPayment(done,
            (res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal('high');
            },
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            "4J8vmnlYPwzYzia74fny81",
            PARTY_ID,
            SHOP_ID,
            10);
    });
});
