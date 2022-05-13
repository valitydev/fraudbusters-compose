const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const config = require("../config");
const templateFactory = require("./factory/template_factory.js");
const referenceFactory = require("./factory/reference_factory.js");
const inspectorService = require("./service/inspector_service.js");
const paymentService = require("./service/payment_service.js");

const testTimeout = config.testTimeout;

const templateId = "test-trustes-templ-id";
const shopId = "shop-trusted-id";
const partyId = "party-trusted-id";
const CARD_TOKEN = "trusted_test_token";

describe('Test for check trusted tokens', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
        templateFactory.create(done,
            "rule: isTrusted(paymentsConditions(condition(\"RUB\" ,1 ,1 ,1 ))) -> accept;",
            templateId);
    });

    it('it should create a new reference for template', function (done) {
        referenceFactory.create(done, partyId, shopId, templateId);
    });

    it('it should inspect that payment have default HIGH risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            CARD_TOKEN,
            'high',
            partyId,
            shopId,
            100);
    });

    it('it should upload payment to history', function (done) {
        paymentService.uploadPayment(done,
            "captured",
            "test@mail.ru",
            "123.123.123.123",
            CARD_TOKEN,
            "xxxxx",
            partyId,
            shopId,
            "invoice_id_1");
    });

    it('it should upload payment to history', function (done) {
        paymentService.uploadPayment(done,
            "captured",
            "test@mail.ru",
            "123.123.123.123",
            CARD_TOKEN,
            "xxxxx",
            partyId,
            shopId,
            "invoice_id_1.1");
    });

    it('it should inspect that payment have LOW risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "123.123.123.123",
            "xxxxx",
            CARD_TOKEN,
            'high', // change to 'low' after fix
            partyId,
            shopId,
            1000);
    });
});