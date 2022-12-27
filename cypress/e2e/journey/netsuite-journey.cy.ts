/// <reference types="cypress" />
import environment from 'src/environments/environment.json';
describe('netsuite journey', () => {
  beforeEach(() => {
    cy.journeyLogin()
    cy.visit('/')
  })

  function connectNetsuiteSetting() {
    cy.get('.onboarding-stepper--desc').eq(1).contains('Connect to NetSuite Account')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Connect NetSuite').click()
    cy.url().should('include', '/settings/netsuite')
    cy.get('.page-header--name').contains('NetSuite Connection')
    cy.assertText('connect-netsuite-header','Connect to your NetSuite account to start exporting expense data from Fyle.')
    cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').first().contains('NetSuite Account ID')
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(0).then(($el) => {
        expect($el[0].innerHTML).to.be.empty
    })
    cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').eq(1).contains('NetSuite Token ID')
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(1).then(($el) => {
        assert.equal($el[0].innerHTML,'')
    })
    cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').eq(2).contains('NetSuite Token Secret')
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(2).then(($el) => {
        expect($el).to.be.empty
    })
    cy.assertText('save-btn', 'Save')
    cy.getElement('save-btn').then(($el) => {
        expect($el).to.be.disabled
    })
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(0).clear()
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(0).type(environment.e2e_tests.secret[1].ns_account_id)
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(1).clear()
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(1).type(environment.e2e_tests.secret[1].ns_token_id)
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(2).clear()
    cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(2).type(environment.e2e_tests.secret[1].ns_token_secret)
    cy.getElement('save-btn').then(($el) => {
        expect($el).to.be.enabled
    })
    cy.getElement('save-btn').click()
    cy.get('.cdk-overlay-container').contains('NetSuite account connected successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(1).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function netsuiteSubsidiarySetting() {
    cy.get('.onboarding-stepper--desc').eq(2).contains('Select NetSuite Subsidiary')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Select Subsidiary').click()
    cy.url().should('include', '/settings/configurations/subsidiary/')
    cy.get('subsidiary-heading').contains('Set up NetSuite Subsidiary.')
    cy.getElement('subsidiary-options').click().get('mat-options').contains('Honeycomb Mfg.').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(2).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function configurationSetting() {
    cy.get('.onboarding-stepper--desc').eq(3).contains('Select NetSuite Subsidiary')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Select Subsidiary').click()
    cy.url().should('include', '/settings/configurations/general/')
    cy.get('.page-header--name').contains('Configurations')
    cy.getElement('employee-to-netsuite').click().get('mat-options').contains('Employee').click()
    cy.getElement('map-reimbursable-expense').click().get('mat-options').contains('Journal Entry').click()
    cy.getElement('ccc-expense').click().get('mat-options').contains('Bill').click()
    cy.getElement('sync-payments').click().get('mat-options').contains('Import NetSuite Payments into Fyle').click()
    cy.getElement('employee-from-fyle').click().get('mat-options').contains('Match names on Fyle and Netsuite').click()
    cy.getElement('auto-create-employee').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.get('.cdk-overlay-container').contains('Configuration saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(3).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function bankAccountSetting() {
    cy.get('.onboarding-stepper--desc').eq(4).contains('Map Bank Accounts')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Go to General Mappings').click()
    cy.url().should('include', '/settings/general/mappings/')
    cy.get('.page-header--name').contains('General Mappings')
    cy.getElement('NS-location').click().get('mat-options').contains('01: San Francisco').click()
    cy.getElement('NS-location-level').click().get('mat-options').contains('Transaction Body').click()
    cy.getElement('vendor-payable-account').click().get('mat-options').contains('Accounts Payable').click()
    cy.getElement('employee-payable-account').click().get('mat-options').contains('ABN Withholding').click()
    cy.getElement('default-ccc-account').click().get('mat-options').contains('California EDD (HQ)').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.get('.cdk-overlay-container').contains('General Mappings saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(4).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function ccSetting() {
    cy.get('.onboarding-stepper--desc').eq(4).contains('Map Corporate Cards')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Skip').click()
  }

  function employeeSetting() {
    cy.get('.onboarding-stepper--desc').eq(5).contains('Map Employees')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Go to Employee Mappings').click()
    cy.url().should('include', '/settings/employee/mappings/')
    cy.get('.page-header--name').contains('Employee Mapping')
    cy.get('button').contains('Create Employee Mapping').click()
    cy.getElement('employee-model').children('div').eq(0).contains('Create New Mapping')
    cy.getElement('employee-value').get('input').eq(1).type('admin1@fyleforjourney.in')
    cy.getElement('fyle-employee-data').get('mat-autocomplete').get('mat-option').eq(0).click()
    cy.getElement('employee-value').get('input').eq(2).type('ashwin')
    cy.getElement('employee-value').get('mat-autocomplete').get('mat-option').eq(0).click()
    cy.getElement('employee-value').get('input').eq(2).should('have.value', 'Ashwin')
    cy.assertText('save-btn','Save')
    cy.getElement('save-btn').click()
    cy.getElement('employe-name-data').contains('Ashwin')
    cy.getElement('save-btn').contains('Save').click()
    cy.get('.cdk-overlay-container').contains('Employee Mapping saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(5).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function categorySetting() {
    cy.get('.onboarding-stepper--desc').eq(6).contains('Map Categories')
    cy.get('.onboarding-stepper--check').should('not.have.css', 'color', 'rgb(40, 195, 84)')
    cy.get('.onboarding-stepper--navigation').contains('Go to Category Mappings').click()
    cy.url().should('include', '/settings/category/mappings/')
    cy.get('.page-header--name').contains('Category Mappings')
    cy.get('button').first().contains('Create Category Mapping')
    cy.getElement('edit-category-heading').contains('Create New Mapping')
    cy.get('input').eq(1).type('Food')
    cy.getElement('fyle-category-value').eq(0).click()
    cy.get('input').eq(2).type('Food')
    cy.getElement('category-value').eq(0).click()
    cy.get('input').eq(2).should('have.value', 'Food')
    cy.assertText('save-btn','Save')
    cy.getElement('save-btn').click()
    cy.getElement('category-ns-data').contains('Food')
    cy.get('.cdk-overlay-container').contains('Category Mapping saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.assertText('dashboard', 'Dashboard')
  }

  function importFromFyle() {
    cy.getElement('import').click()
    cy.url().should('include', '/sync_export/sync')
    cy.get('.page-header--name').contains('Import & Export')
    cy.getElement('import-btn').contains('Import').click()
    cy.getElement('import-btn').contains('Importing').then(($el) => {
        expect($el).to.be.disabled
    })
    cy.get('mat-progress-bar').should('to.be', 'visible') 
    cy.get('.cdk-overlay-container').contains('import') 
  }

  function exportToNetsuite() {
    cy.getElement('export').click()
    cy.url().should('include', '/sync_export/export')
    cy.get('.export-header').contains('Export Expenses to NetSuite.')
    cy.getElement('export-btn').contains('Export').click()
    cy.getElement('export-btn').contains('Exporting').then(($el) => {
        expect($el).to.be.disabled
    })
    cy.get('mat-progress-bar').should('to.be', 'visible') 
    cy.get('.cdk-overlay-container').contains('Export complete') 
    cy.navigateToModule('Dashboard')
  }

  function resolveError() {
    let error;
    cy.navigateToModule('Expense Groups')
    cy.get('.page-header--name').contains('Expense Groups')
    cy.url().should('include', '/expense_group')
    cy.get('th').contains('Employee')
    cy.getElement('failed-data').eq(0).click()
    cy.url().should('include', '/view/info')
    cy.getElement('error-nav').contains('Mapping Errors').click()
    cy.url().should('include', '/view/mapping_errors')
    cy.get('td').eq(0).click()
    cy.get('input').eq(1).then(($el) => {
        error = $el.val()
    })
    cy.get('input').eq(2).type('Training')
    cy.getElement('category-value').eq(0).click()
    cy.get('input').eq(2).should('have.value', 'Training')
    cy.assertText('save-btn','Save')
    cy.getElement('save-btn').click()
    cy.get('.cdk-overlay-container').contains('Category is mapped successfully, you can try re-exporting the failed entries') 
    exportToNetsuite()
    cy.navigateToModule('Expense Groups')
    cy.getElement('failed-data').eq(0).click()
    cy.getElement('error-nav').contains('Mapping Errors').click()
    cy.get('td').eq(0).click()
    cy.get('input').eq(1).then(($el) => {
        expect($el).to.have.text(error)
    })
  }

  it('Netsuite Onbording journey', () => {
    cy.url().should('include', '/dashboard')
    cy.assertText('welcome-text','Welcome to Fyle App for NetSuite Integrations')
    cy.assertText('welcome-sub-text','get you on board with a few quick steps!')
    cy.get('.onboarding-stepper--step-header').eq(0).contains('Connect to your Fyle & NetSuite accounts')
    cy.get('.onboarding-stepper--step-header').eq(1).contains('Configure Fyle NetSuite app')
    cy.get('.onboarding-stepper--step-header').eq(2).contains('Map Fyle fields to NetSuite')
    cy.get('.onboarding-stepper--desc').eq(0).contains('Connect to Fyle Account')
    cy.get('.onboarding-stepper--check__complete').should('have.css', 'color', 'rgb(40, 195, 84)')

    connectNetsuiteSetting()

    netsuiteSubsidiarySetting()

    configurationSetting()

    bankAccountSetting()

    ccSetting()

    employeeSetting()

    categorySetting()

    importFromFyle()
    
    exportToNetsuite()

    resolveError()

  })
})
