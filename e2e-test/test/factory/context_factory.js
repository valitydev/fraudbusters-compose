const CARD_TOKEN = "aggr_test_token";
const IP = "192.1.1.1";
const EMAIL = "test_unique@vality.dev";
const INVOICE_ID = "invoice_id";

module.exports.create =
    function (id, ip, email, fingerprint, cardToken, partyId, shopId, amount, currency) {
        return {
            id: id || INVOICE_ID,
            payerInfo: {
                ip: ip || IP,
                email: email || EMAIL,
                fingerprint: fingerprint,
                phone: "79111111111"
            },
            cashInfo: {
                amount: amount || 10000,
                currency: currency || "RUB"
            },
            bankCard: {
                bin: "427640",
                lastDigits: "6395",
                binCountryCode: "RUS",
                cardToken: cardToken || CARD_TOKEN,
                bankName: "bank",
                cardType: "debit",
                paymentSystem: "visa"
            },
            merchantInfo: {
                shopId: shopId, partyId: partyId
            },
            providerInfo: {
                providerId: "provider", terminalId: "term", country: "RUS"
            },
            mobile: false,
            recurrent: false,
            payerType: "payment_resource",
            tokenMobileProvider: null,
            createdAt: Date.now() / 1000
        };
    }