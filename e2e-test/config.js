module.exports = {
  fbManagement: {
    url: process.env.FB_MNGMT_URL || "http://fb-management:8080",
    templatePath: process.env.FB_M_TEMPLATE_PATH || '/fb-management/v1/payments-templates',
    referencePath: process.env.FB_M_REFEREBCE_PATH || '/fb-management/v1/payments-references',
    groupPath: process.env.FB_M_GROUP_PATH || '/fb-management/v1/payments-groups',
  },
  fb: {
    inspectPath: process.env.FB_INSPECT_PATH || '/fraudbusters/inspect-payment',
    historyPaymentsPath: process.env.FB_HISTORY_PAYMENT_PATH || '/fraudbusters/payments',
  },
  fbApi: {
    url: process.env.FB_API_URL || "http://fraudbusters-api:8080"
  },
  testTimeout: process.env.TEST_TIMEOUT || '60000'
}
