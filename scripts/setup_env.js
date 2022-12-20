const { writeFile } = require("fs");

const environment = {
  production: `${process.env.PRODUCTION ? process.env.PRODUCTION : "false"}`,
  fyle_url: `${process.env.FYLE_URL ? process.env.FYLE_URL : '{{FYLE_URL}}'}`,
  fyle_app_url: `${process.env.FYLE_APP_URL ? process.env.FYLE_APP_URL : '{{FYLE_APP_URL}}'}`,
  fyle_client_id: `${process.env.FYLE_CLIENT_ID ? process.env.FYLE_CLIENT_ID : '{{FYLE_CLIENT_ID}}'}`,
  callback_uri: `${process.env.CALLBACK_URI ? process.env.CALLBACK_URI : '{{CALLBACK_URI}}'}`,
  api_url: `${process.env.API_URL ? process.env.API_URL : '{{API_URL}}'}`,
  app_url: `${process.env.APP_URL ? process.env.APP_URL : '{{APP_URL}}'}`,
  sentry_dsn: `${process.env.SENTRY_DSN ? process.env.SENTRY_DSN : '{{SENTRY_DSN}}'}`,
  release: `${process.env.RELEASE ? process.env.RELEASE : '{{RELEASE}}'}`,
  e2e_tests: {
    env: `${process.env.E2E_TESTS_ENV ? process.env.E2E_TESTS_ENV : '{{E2E_TESTS_ENV}}'}`,
    client_id: `${process.env.E2E_TESTS_CLIENT_ID ? process.env.E2E_TESTS_CLIENT_ID : '{{E2E_TESTS_CLIENT_ID}}'}`,
    secret: [{
      workspace_id: `${process.env.E2E_TESTS_WORKSPACE_ID_1 ? process.env.E2E_TESTS_WORKSPACE_ID_1 : '{{E2E_TESTS_WORKSPACE_ID_1}}'}`,
      access_token: 'ab.cd.ef',
      org_id: `${process.env.E2E_TESTS_ORG_ID_1 ? process.env.E2E_TESTS_ORG_ID_1 : '{{E2E_TESTS_ORG_ID_1}}'}`,
      refresh_token: `${process.env.E2E_TESTS_REFRESH_TOKEN_1 ? process.env.E2E_TESTS_REFRESH_TOKEN_1 : '{{E2E_TESTS_REFRESH_TOKEN_1}}'}`,
      ns_account_id: `${process.env.E2E_TESTS_NS_ACCOUNT_ID_1 ? process.env.E2E_TESTS_NS_ACCOUNT_ID_1 : '{{E2E_TESTS_NS_ACCOUNT_ID_1}}'}`,
      ns_token_id: `${process.env.E2E_TESTS_NS_TOKEN_ID_1 ? process.env.E2E_TESTS_NS_TOKEN_ID_1 : '{{E2E_TESTS_NS_TOKEN_ID_1}}'}`,
      ns_token_secret: `${process.env.E2E_TESTS_NS_TOKEN_SECRET_1 ? process.env.E2E_TESTS_NS_TOKEN_SECRET_1 : '{{E2E_TESTS_NS_TOKEN_SECRET_1}}'}`,
    },
    {
      workspace_id: `${process.env.E2E_TESTS_WORKSPACE_ID_2 ? process.env.E2E_TESTS_WORKSPACE_ID_2 : '{{E2E_TESTS_WORKSPACE_ID_2}}'}`,
      access_token: 'ab.cf.ed',
      org_id: `${process.env.E2E_TESTS_ORG_ID_2 ? process.env.E2E_TESTS_ORG_ID_2 : '{{E2E_TESTS_ORG_ID_2}}'}`,
      refresh_token: `${process.env.E2E_TESTS_REFRESH_TOKEN_2 ? process.env.E2E_TESTS_REFRESH_TOKEN_2 : '{{E2E_TESTS_REFRESH_TOKEN_2}}'}`,
      ns_account_id: `${process.env.E2E_TESTS_NS_ACCOUNT_ID_2 ? process.env.E2E_TESTS_NS_ACCOUNT_ID_2 : '{{E2E_TESTS_NS_ACCOUNT_ID_2}}'}`,
      ns_token_id: `${process.env.E2E_TESTS_NS_TOKEN_ID_2 ? process.env.E2E_TESTS_NS_TOKEN_ID_2 : '{{E2E_TESTS_NS_TOKEN_ID_2}}'}`,
      ns_token_secret: `${process.env.E2E_TESTS_NS_TOKEN_SECRET_2 ? process.env.E2E_TESTS_NS_TOKEN_SECRET_2 : '{{E2E_TESTS_NS_TOKEN_SECRET_2}}'}`,
    }
  ]
  }
};

const targetPath = './src/environments/environment.json';
writeFile(targetPath, JSON.stringify(environment), 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});