# Fyle NetSuite APP
Angular 8 client for Fyle NetSuite Integration

### Setup

## Local development setup

### Setup - 1 (Recommended)
Follow instructions mentioned in [Integrations Central](https://github.com/fylein/fyle-integrations-central/)

### Setup - 2
* Install dependencies

    ```bash
    npm install
    ```

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/netsuite-app/environment.json src/environments/environment.json
    ```

* Run app

    ```bash
    npm start
    ```
## Running End to End Tests on local
### Setup Org to test
<b>Note:</b> *All the steps mentioned in this section are one time activity*
* It would be very easy if we use this org for running tests since we have pre populated data in Fyle to run tests
    ```for post onboarding
    Email: admin1@fyleformicro.testing | Org Name: Fyle For netsuiteMicroActiontesting
    ```
    ```for onboarding
    Email: admin1@fyleforjourney.in | Org Name: Fyle For netsuitejourneytesting
    ```
* Login to this org on [local](http:localhost:4200) 
* Update values for these variables in `e2e_tests` key in `environment.json` (present in `src/environments`) -
*(Copy all these values from local storage)*
<b>Note:</b> *Copy refresh_token from `user` key in local storage*
    ```
        "workspace_id": "",
        "refresh_token": "",
        "org_id": ""
    ```

* Create an sql function to partially setup an org to run tests -
    ```bash
    # bash into database
    \i ../fyle-netsuite-api/sql/functions/reset-worspace.sql;
    ```

* Partially reset the org using the sql script we created -
    ```sql
    select reset_workspace(<workspace_id_goes_here>);
    ```
### Helper commands
* Make sure the app and api is up and running
* To open Cypress UI and run end to end test spec wise, use this command -
    ```bash
    npm run cypress:open
    ```
    <b>Note</b>: *Running this command will decrease the code coverage since we run 1 test at a time*

* To run all end to end tests and update code coverage, use this command -
    ```bash
    npm run cypress:run
    ```
    <b>Note</b>: *Running this command will update the code coverage*
*This step is highly recommended when you write a new end to end test*
* To reset the org to initial data, use the `reset_workspace()` sql function and re run tests

### Bonus points
* Name the test file in the sequence followed and place them in the right folder. Cypress tests gets executed in an alphabetical manner, as of now.
* If we are writing a test that represent an user journey, create the test in the journey folder. Or if it represents a micro action, place it in the micro-actions folder. If we add a new feature and wanted to cover all possible scenarios to write a test, add it to the feature folder, along with month and year.

### End to End Tests on Github
* End to End tests runs on all PRs, after the PR is approved. Only if all tests pass, contributor will be able to merge it to master. This happens against the staging environment. We'll receive a comment in the PR about the run status and code coverage summary.
* End to End tests against production environment will run every Tuesday and Thursday at 2pm.
* Manually if we wanted to trigger end to end tests, we can make use of manual [github action](https://github.com/fylein/fyle-netsuite-app/actions/workflows/manual-e2e.yml) and run it against Staging/Production environment with the specified branch and click on `Run Workflow` button.
* Once the tests are completed, we'll receive a message on slack with the summary and screen recordings incase the test fails.
* Consider the following scenario for example -
    * Developer raised a PR -> reviewer approved it -> e2e failed -> dev fixed the broken test
    * Now, to trigger the action, the developer should manually trigger the github action by creating a label named `run e2e tests` in the PR.
    * Dev will be able to un label and label them multiple times to trigger e2e tests.
    <b>Note</b>: *Labels can be found in the right side section where Reviewer, Assignee are maintained*

*For more detailed notes, please to check the Notion doc about End to End Tests on netsuite App*
