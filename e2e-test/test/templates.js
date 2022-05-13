const referenceFactory = require('./factory/reference_factory.js');
const templateFactory = require('./factory/template_factory.js');

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const config = require("../config");
const inspectorService = require("./service/inspector_service.js");

const testTimeout = config.testTimeout;
const templateId = "test-templ-id";

describe('Test for simple rule inspection', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
        templateFactory.create(done, "rule:amount_test:amount() >= 20 -> decline;", templateId);
    });

    it('it should create a new reference for template', function (done) {
        referenceFactory.create(done, "partyTest", "shopTest", templateId);
    });

    it('it should inspect that payment have FATAL risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            "4J8vmnlYPwzYzia74fny81",
            'fatal',
            "partyTest",
            "shopTest",
            100);
    });

    it('it should inspect that payment have default HIGH risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            "4J8vmnlYPwzYzia74fny81",
            'high',
            "partyTest",
            "shopTest",
            10);
    });
});
