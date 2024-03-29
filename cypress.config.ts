import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'v7wbae',
  e2e: {
    baseUrl: environment.app_url,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  },
  viewportHeight: 980,
  viewportWidth: 1440,
  defaultCommandTimeout: 60000,
  requestTimeout: 60000
});
