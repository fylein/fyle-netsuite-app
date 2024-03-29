/// <reference types="cypress" />
import environment from 'src/environments/environment.json';

declare global {
    namespace Cypress {
      interface Chainable {
        journeyLogin(): void;
        microActionsLogin(): void;
        getElement(attributeName: string): Cypress.Chainable<JQuery<HTMLElement>>;
        assertText(attributeName: string, text: string): void;
        selectMatOption(optionName: string): void;
        submitButton(content: string): Cypress.Chainable<JQuery<HTMLElement>>;
        saveSetting(content: string): void;
        getMatToggle(toggleIndex: number): Cypress.Chainable<JQuery<HTMLElement>>;
        setupHttpListeners(): void;
        navigateToSettingPageItems(pageName: string): void;
        exportsPolling(): void;
        interrupt(): void;
        navigateToModule(pageName: string): void;
        enableConfigurationToggle(fieldOrder: number): void;
      }
    }
  }

  function setupInterceptor(method: 'GET' | 'POST', url: string, alias: string) {
    cy.intercept({
      method: method,
      url: `**${url}**`,
    }).as(alias);
  }

  Cypress.Commands.add('journeyLogin', () => {
    const user = {
      email: 'admin1@fyleforjourney.in',
      access_token: environment.e2e_tests.secret[0].access_token,
      refresh_token: environment.e2e_tests.secret[0].refresh_token,
      full_name: 'Theresa Brown',
      user_id: 'xyz',
      org_id: environment.e2e_tests.secret[0].org_id,
      org_name: 'XYZ Org'
    };
    window.localStorage.setItem('user', JSON.stringify(user))
    window.localStorage.setItem('workspaceId', JSON.stringify(environment.e2e_tests.secret[0].workspace_id))
    window.localStorage.setItem('access_token', JSON.stringify(user.access_token))
    window.localStorage.setItem('refresh_token', JSON.stringify(user.refresh_token))
    cy.setupHttpListeners();
  })

  Cypress.Commands.add('microActionsLogin', () => {
    const user = {
      email: 'admin1@fyleformicro.testing',
      access_token: environment.e2e_tests.secret[1].access_token,
      refresh_token: environment.e2e_tests.secret[1].refresh_token,
      full_name: 'Theresa Brown',
      user_id: 'xyz',
      org_id: environment.e2e_tests.secret[1].org_id,
      org_name: 'XYZ Org'
    };
    window.localStorage.setItem('user', JSON.stringify(user))
    window.localStorage.setItem('workspaceId', JSON.stringify(environment.e2e_tests.secret[1].workspace_id))
    window.localStorage.setItem('onboarded', 'true')
    window.localStorage.setItem('access_token', JSON.stringify(user.access_token))
    window.localStorage.setItem('refresh_token', JSON.stringify(user.refresh_token))
  
    // cy.login() will be used in all tests, hence adding http listener here
    cy.setupHttpListeners();
  })

  Cypress.Commands.add('getElement', (attributeName: string) => {
    return cy.get(`[data-cy=${attributeName}]`);
  })

  Cypress.Commands.add('assertText', (attributeName: string, text: string) => {
    cy.getElement(attributeName).should('include.text', text)
  })

  Cypress.Commands.add('setupHttpListeners', () => {
    // This helps cypress to wait for the http requests to complete with 200, regardless of the defaultCommandTimeout (10s)
    // Usage: cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)
    // cy.intercept('POST', '**/refresh_dimensions', {}).as('refreshDimension')
  
    // setupInterceptor('GET', '/qbo/destination_attributes/', 'getDestinationAttributes');
  
    // setupInterceptor('POST', '/fyle/expense_groups/sync', 'synchronousImport');
  
    // setupInterceptor('GET', '/fyle/exportable_expense_groups', 'exportableExpenseGroups');
  
    setupInterceptor('GET', '/tasks/all/', 'tasksPolling');
  
    setupInterceptor('POST', '/exports/trigger', 'exportsTrigger');
  
    // setupInterceptor('POST', '/mappings/employee', 'postEmployeeMapping');
  
    // setupInterceptor('GET', '/errors/', 'getErrors');
  
    // setupInterceptor('GET', '/export_detail', 'getPastExport');
  
    // setupInterceptor('GET', '/fyle/expense_groups/', 'getExpenseGroups')
  
    const setting = {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
          {
              "id": 1,
              "source_field": "COST_CENTER",
              "destination_field": "CLASS",
              "import_to_fyle": false,
              "is_custom": false,
              "source_placeholder": null,
              "created_at": "2022-12-19T11:53:39.828777Z",
              "updated_at": "2022-12-23T06:55:17.526425Z",
              "workspace": environment.e2e_tests.secret[1].workspace_id
          },
      ]
    }
    cy.intercept('GET', '**/mappings/settings/', setting)

    setupInterceptor('GET', '/configuration', 'getConfigurationSettings')
  
    setupInterceptor('GET', '/fyle/expense_groups/count/?state=COMPLETE', 'getCompletedCount')
  
    setupInterceptor('GET', '/fyle/expense_groups/count/?state=FAILED', 'getFailedCount')

    setupInterceptor('GET', '/credentials/netsuite/', 'getNetsuiteCreds')
  
    // setupInterceptor('GET', '/qbo/mapping_options/', 'getMappingOptions')
  });
  
  Cypress.Commands.add('selectMatOption', (optionName) => {
    cy.get('mat-option').contains(optionName).click()
  })
  
  Cypress.Commands.add('submitButton', (content: string | void) => {
    const button = cy.get('.configuration--submit-btn')
    return content ? button.contains(content) : button
  })
  
  Cypress.Commands.add('saveSetting', (content: string) => {
    cy.submitButton(content).click()
  })
  
  Cypress.Commands.add('getMatToggle', (toggleIndex: number) => {
    return cy.get('.mat-slide-toggle-bar').eq(toggleIndex)
  })
  
  Cypress.Commands.add('navigateToSettingPageItems', (pageName: string) => {
    cy.getElement('side-nav').find('.netsuite-sidenav--nav-sub-item').contains(pageName).click();
  })
  
  Cypress.Commands.add('exportsPolling', () => {
    // Wait till the exports are processed
    cy.wait('@tasksPolling').then((http) => {
      const filteredTasks = http.response.body.results.filter((task: any) => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED')).length
  
      if (filteredTasks > 0) {
        cy.exportsPolling()
      } else {
        assert.equal(filteredTasks, 0, 'All tasks are processed')
      }
    })
  })
  
  Cypress.Commands.add('navigateToModule', (pageName: string) => {
    cy.getElement('side-nav').find('.netsuite-sidenav--nav-item').contains(pageName).click()
  })
  
  Cypress.Commands.add('enableConfigurationToggle', (fieldOrder: number) => {
    cy.getMatToggle(fieldOrder).click()
  })
  
