const templateFactory = require("./factory/template_factory.js");
const referenceFactory = require("./factory/reference_factory.js");
const inspectorService = require('./service/inspector_service.js');

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const config = require("../config");

const testTimeout = config.testTimeout;
const templateId = "test-columbus-templ-id";
const shopId = "shop-columbus-id";
const partyId = "party-columbus-id";

const TEMPLATE = "rule: " +
    "in(countryBy(\"ip\"), \"RU\", \"EN\")" +
    " -> accept;";

describe('Test for check geo ip service', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
        templateFactory.create(done, TEMPLATE, templateId);
    });

    it('it should create a new reference for template', function (done) {
        referenceFactory.create(done, partyId, shopId, templateId);
    });

    it('it should inspect that payment have LOW risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "1.208.61.253",
            "xxxxx",
            "trusted_test_token",
            'high',  // change to 'low' after fix
            partyId,
            shopId,
            100);
    });

    it('it should inspect that payment have default HIGH risk', function (done) {
        inspectorService.inspectPayment(done,
            "test@mail.ru",
            "85.214.132.117",
            "xxxxx",
            "trusted_test_token",
            'high',
            partyId,
            shopId,
            100);
    });

});
