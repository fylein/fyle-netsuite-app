declare var $ENV: Env;

interface Env {
  PRODUCTION: string;
  FYLE_URL: string;
  FYLE_CLIENT_ID: string;
  CALLBACK_URI: string;
  FYLE_APP_URL: string;
  CLUSTER_DOMAIN_API_URL: string;
  APP_URL: string;
  SENTRY_DSN: string;
  RELEASE: string;
}