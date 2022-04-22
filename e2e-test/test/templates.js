const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const config = require("../config");

const FB_MGMNT_URL = config.fbManagement.url;
const FB_API_URL = config.fbApi.url;

const TEMPLATE_PATH = config.fbManagement.templatePath;
const REFERENCE_PATH = config.fbManagement.referencePath;
const INSPECT_PATH = config.fb.inspectPath;

const testTimeout = config.testTimeout;
const templateId = "test-templ-id";


describe('Test for simple rule inspection', function () {
    this.timeout(testTimeout);

    it('it should create a new template', function (done) {
        let TEST_TEMPLATE = {
            id: templateId,
            lastUpdateDate: "2022-04-15T10:30:00",
            modifiedByUser: "test-user",
            template: "rule:amount_test:amount() >=20 -> decline;"
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
    });

    it('it should create a new reference for template', function (done) {
        let TEST_REFERENCES = [
            {
                id: "test-ref-id",
                lastUpdateDate: "2022-04-15T10:30:30",
                modifiedByUser: "test-user",
                shopId: "shopTest",
                partyId: "partyTest",
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
    });

    it('it should inspect that payment have FATAL risk', function (done) {
        let TEST_INSPECTOR_PAYMENT_REQ_HIGH = {
            context: {
                id: "invoice_id",
                payerInfo: {
                    ip: "123.123.123.123",
                    email: "test@mail.ru",
                    fingerprint: "xxxxx",
                    phone: "79111111111"
                },
                cashInfo: {
                    amount: 100,
                    currency: "RUB"
                },
                bankCard: {
                    bin: "427640",
                    lastDigits: "6395",
                    binCountryCode: "RUS",
                    cardToken: "4J8vmnlYPwzYzia74fny81",
                    bankName: "bank",
                    cardType: "debit",
                    paymentSystem: "visa"
                },
                merchantInfo: {
                    shopId: "shopTest",
                    partyId: "partyTest"
                },
                providerInfo: {
                    providerId: "provider",
                    terminalId: "term",
                    country: "RUS"
                },
                mobile: false,
                recurrent: false,
                payerType: "payment_resource",
                tokenMobileProvider: null,
                createdAt: 1.65038182E9
            }
        };

        chai.request(FB_API_URL)
            .post(INSPECT_PATH)
            .send(TEST_INSPECTOR_PAYMENT_REQ_HIGH)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal("fatal");
                done()
            });
    });

    it('it should inspect that payment have default HIGH risk', function (done) {
        let TEST_INSPECTOR_PAYMENT_REQ_LOW = {
            context: {
                id: "invoice_id",
                payerInfo: {
                    ip: "123.123.123.123",
                    email: "test@mail.ru",
                    fingerprint: "xxxxx",
                    phone: "79111111111"
                },
                cashInfo: {
                    amount: 10,
                    currency: "RUB"
                },
                bankCard: {
                    bin: "427640",
                    lastDigits: "6395",
                    binCountryCode: "RUS",
                    cardToken: "4J8vmnlYPwzYzia74fny81",
                    bankName: "bank",
                    cardType: "debit",
                    paymentSystem: "visa",
                },
                merchantInfo: {
                    shopId: "shopTest",
                    partyId: "partyTest"
                },
                providerInfo: {
                    providerId: "provider",
                    terminalId: "term",
                    country: "RUS"
                },
                mobile: false,
                recurrent: false,
                payerType: "payment_resource",
                tokenMobileProvider: null,
                createdAt: 1.65038182E9
            }
        };

        chai.request(FB_API_URL)
            .post(INSPECT_PATH)
            .send(TEST_INSPECTOR_PAYMENT_REQ_LOW)
            .end(function (err, res) {
                if (err) {
                    console.log(err.text);
                    done(err);
                }
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("result");
                res.body.result.should.equal("high");
                done()
            });
    });

});
