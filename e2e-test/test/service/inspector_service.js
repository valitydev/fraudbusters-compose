const chai = require("chai");
const config = require("../../config");
const chaiHttp = require("chai-http");
const contextFactory = require("../factory/context_factory.js");
const should = chai.should();
chai.use(chaiHttp);

const FB_API_URL = config.fbApi.url;
const INSPECT_PATH = config.fb.inspectPath;

module.exports.inspectPayment =
    function (done, email, ip, fingerprint, cardToken, result, partyId, shopId, amount, currency) {
        let TEST_INSPECTOR_PAYMENT_REQ_HIGH = {
            context: contextFactory.create(
                "invoice_id",
                ip,
                email,
                fingerprint,
                cardToken,
                partyId,
                shopId,
                amount,
                currency
            )
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
                res.body.result.should.equal(result);
                done()
            });
    }