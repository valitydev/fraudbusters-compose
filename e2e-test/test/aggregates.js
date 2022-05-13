const referenceFactory = require('./factory/reference_factory.js');
const templateFactory = require('./factory/template_factory.js');
const paymentService = require('./service/payment_service.js');
const inspectorService = require('./service/inspector_service.js');

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const config = require("../config");

const testTimeout = config.testTimeout;

const TEMPLATE_ID = "test-templ-aggr-id";
const SHOP_ID = "shop-aggr-id";
const PARTY_ID = "party-aggr-id";
const CARD_TOKEN = "aggr_test_token";
const AGGR_FINGERPRINT = "aggr_fingerprint";
const EMAIL = "test_unique@vality.dev";

const TEMPLATE = "rule: unique(\"ip\", \"email\", 30, days, \"party_id\", \"shop_id\") > 1 " +
    " OR count(\"card_token\", 30, days, \"party_id\", \"shop_id\") > 2 " +
    "OR (sum(\"fingerprint\", 30, days, \"party_id\", \"shop_id\") > 20000 " +
    " AND currency() = \"RUB\")" +
    " -> decline;";

function generateIp(prefix) {
    return prefix + Math.floor(Math.random() * 999);
}

function generateCardToken() {
    return CARD_TOKEN + Math.floor(Math.random() * 999);

}

function generateFingerprint() {
    return AGGR_FINGERPRINT + Math.floor(Math.random() * 999);
}

const status = "processed";
describe('Test for check aggregates', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
        templateFactory.create(done, TEMPLATE, TEMPLATE_ID);
    });

    it('it should create a new reference for template', function (done) {
        referenceFactory.create(done, PARTY_ID, SHOP_ID, TEMPLATE_ID);
    });

    let ipUniq = generateIp("192.1.1.");
    let cardToken = generateCardToken();
    let fingerprint = generateFingerprint();

    it('it should inspect that payment have HIGH risk for UNIQUE', function (done) {
        inspectorService.inspectPayment(done, EMAIL, ipUniq, fingerprint, cardToken, 'high', PARTY_ID, SHOP_ID);
    });

    it('it should upload payment to history', function (done) {
        paymentService.uploadPayment(done, status, EMAIL, ipUniq, cardToken, fingerprint, PARTY_ID, SHOP_ID);
    });

    const emailUnique = 'test_unique_2@vality.dev';

    it('it should inspect that payment have FATAL risk for UNIQUE', function (done) {
        inspectorService.inspectPayment(done, emailUnique, ipUniq, fingerprint, cardToken, 'fatal', PARTY_ID, SHOP_ID);
    });

    it('it should upload payment to history', function (done) {
        paymentService.uploadPayment(done, status, emailUnique, ipUniq, cardToken, fingerprint, PARTY_ID, SHOP_ID);
    });

    const ipCount = generateIp("192.1.2.");
    const emailCount = "test_count@vality.dev";

    it('it should inspect that payment have FATAL risk for COUNT', function (done) {
        inspectorService.inspectPayment(done, emailCount, ipCount, fingerprint, cardToken, 'fatal', PARTY_ID, SHOP_ID);
    });

    const emailSum = "test_sum@vality.dev";
    let cardTokenSum = generateCardToken();

    it('it should inspect that payment have FATAL risk for SUM', function (done) {
        inspectorService.inspectPayment(done, emailSum, ipCount, fingerprint, cardTokenSum, 'fatal', PARTY_ID, SHOP_ID);
    });
});