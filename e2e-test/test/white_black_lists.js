//TODO after fix api

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const should = chai.should();
// chai.use(chaiHttp);
// const config = require("../config");
//
// const FB_MGMNT_URL = config.fbManagement.url;
// const FB_API_URL = config.fbApi.url;
//
// const TEMPLATE_PATH = config.fbManagement.templatePath;
// const GROUP_PATH = config.fbManagement.groupPath;
// const INSPECT_PATH = config.fb.inspectPath;
//
// const testTimeout = config.testTimeout;
// const templateId = "test-wb-templ-id";
// const templateRefId = "test-wb-ref-id";
// const shopId = "shop-wb-id";
// const partyId = "party-wb-id";
// const GROUP_ID = "group_1";
//
// describe('Test for check white, black and grey tokens', function () {
//     this.timeout(testTimeout);
//
//     it('it should create a new template_1', function (done) {
//         let TEST_TEMPLATE = {
//             id: templateId + "_1",
//             lastUpdateDate: "2022-04-15T10:30:00",
//             modifiedByUser: "test-user",
//             template: "rule: " +
//                 "inWhiteList(\"email\")" +
//                 " -> accept;"
//         };
//
//         chai.request(FB_MGMNT_URL)
//             .post(TEMPLATE_PATH)
//             .send(TEST_TEMPLATE)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.have.property("id");
//                 res.body.id.should.equal(TEST_TEMPLATE.id);
//                 done()
//             });
//     });
//
//     it('it should create a new template_2', function (done) {
//         let TEST_TEMPLATE = {
//             id: templateId + "_2",
//             lastUpdateDate: "2022-04-15T10:30:00",
//             modifiedByUser: "test-user",
//             template: "rule: " +
//                 "inGreyList(\"cardToken\") " +
//                 " -> accept;"
//         };
//
//         chai.request(FB_MGMNT_URL)
//             .post(TEMPLATE_PATH)
//             .send(TEST_TEMPLATE)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.have.property("id");
//                 res.body.id.should.equal(TEST_TEMPLATE.id);
//                 done()
//             });
//     });
//
//     it('it should create a new template_3', function (done) {
//         let TEST_TEMPLATE = {
//             id: templateId + "_3",
//             lastUpdateDate: "2022-04-15T10:30:00",
//             modifiedByUser: "test-user",
//             template: "rule: " +
//                 "inBlackList(\"cardToken\")" +
//                 " -> decline;"
//         };
//
//         chai.request(FB_MGMNT_URL)
//             .post(TEMPLATE_PATH)
//             .send(TEST_TEMPLATE)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.have.property("id");
//                 res.body.id.should.equal(TEST_TEMPLATE.id);
//                 done()
//             });
//     });
//     //
//     // it('it should create a new group for templates', function (done) {
//     //     let TEST_GROUP = {
//     //         groupId: GROUP_ID,
//     //         modifiedByUser: "test-user",
//     //         priorityTemplates: [
//     //             {
//     //                 id: templateId + "_1",
//     //                 lastUpdateTime: "2019-08-24T14:15:22Z",
//     //                 priority: 0
//     //             },
//     //             {
//     //                 id: templateId + "_2",
//     //                 lastUpdateTime: "2019-08-24T14:15:22Z",
//     //                 priority: 1
//     //             },
//     //             {
//     //                 id: templateId + "_3",
//     //                 lastUpdateTime: "2019-08-24T14:15:22Z",
//     //                 priority: 2
//     //             }]
//     //     };
//     //
//     //     chai.request(FB_MGMNT_URL)
//     //         .post(GROUP_PATH)
//     //         .send(TEST_GROUP)
//     //         .end(function (err) {
//     //             if (err) {
//     //                 console.log(err.text);
//     //                 done(err);
//     //             }
//     //
//     //             done();
//     //         });
//     // });
//
//     it('it should create a new reference for group', function (done) {
//         let TEST_GROUP = [{
//             groupId: GROUP_ID,
//             id: templateRefId,
//             lastUpdateDate: "2022-04-15T10:30:30",
//             modifiedByUser: "test-user",
//             shopId: shopId,
//             partyId: partyId,
//             templateId: templateId
//         }];
//
//         chai.request(FB_MGMNT_URL)
//             .post(GROUP_PATH + '/' + GROUP_ID + '/references')
//             .send(TEST_GROUP)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 done()
//             });
//     });
//
//     it('it should inspect that payment have FATAL risk', function (done) {
//         let TEST_INSPECTOR_PAYMENT_REQ_HIGH = {
//             context: {
//                 id: "invoice_id",
//                 payerInfo: {
//                     ip: "123.123.123.123",
//                     email: "test@mail.ru",
//                     fingerprint: "xxxxx",
//                     phone: "79111111111"
//                 },
//                 cashInfo: {
//                     amount: 100,
//                     currency: "RUB"
//                 },
//                 bankCard: {
//                     bin: "427640",
//                     lastDigits: "6395",
//                     binCountryCode: "RUS",
//                     cardToken: "trusted_test_token",
//                     bankName: "bank",
//                     cardType: "debit",
//                     paymentSystem: "visa"
//                 },
//                 merchantInfo: {
//                     shopId: shopId,
//                     partyId: partyId
//                 },
//                 providerInfo: {
//                     providerId: "provider",
//                     terminalId: "term",
//                     country: "RUS"
//                 },
//                 mobile: false,
//                 recurrent: false,
//                 payerType: "payment_resource",
//                 tokenMobileProvider: null,
//                 createdAt: 1.65038182E9
//             }
//         };
//
//         chai.request(FB_API_URL)
//             .post(INSPECT_PATH)
//             .send(TEST_INSPECTOR_PAYMENT_REQ_HIGH)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.be.a("object");
//                 res.body.should.have.property("result");
//                 res.body.result.should.equal("fatal");
//                 done()
//             });
//     });
//
//     it('it should inspect that payment have default HIGH risk', function (done) {
//         let TEST_INSPECTOR_PAYMENT_REQ_LOW = {
//             context: {
//                 id: "invoice_id",
//                 payerInfo: {
//                     ip: "123.123.123.123",
//                     email: "test@mail.ru",
//                     fingerprint: "xxxxx",
//                     phone: "79111111111"
//                 },
//                 cashInfo: {
//                     amount: 10,
//                     currency: "RUB"
//                 },
//                 bankCard: {
//                     bin: "427640",
//                     lastDigits: "6395",
//                     binCountryCode: "RUS",
//                     cardToken: "trusted_test_token",
//                     bankName: "bank",
//                     cardType: "debit",
//                     paymentSystem: "visa",
//                 },
//                 merchantInfo: {
//                     shopId: shopId,
//                     partyId: partyId
//                 },
//                 providerInfo: {
//                     providerId: "provider",
//                     terminalId: "term",
//                     country: "RUS"
//                 },
//                 mobile: false,
//                 recurrent: false,
//                 payerType: "payment_resource",
//                 tokenMobileProvider: null,
//                 createdAt: 1.65038182E9
//             }
//         };
//
//         chai.request(FB_API_URL)
//             .post(INSPECT_PATH)
//             .send(TEST_INSPECTOR_PAYMENT_REQ_LOW)
//             .end(function (err, res) {
//                 if (err) {
//                     console.log(err.text);
//                     done(err);
//                 }
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.be.a("object");
//                 res.body.should.have.property("result");
//                 res.body.result.should.equal("high");
//                 done()
//             });
//     });
//
// });
