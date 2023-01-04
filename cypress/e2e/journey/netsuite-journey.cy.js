/// <reference types="cypress" />
import environment from 'src/environments/environment.json';
describe('netsuite journey', () => {
  beforeEach(() => {
    cy.journeyLogin()
    cy.visit('/')
  })

  function connectNetsuiteSetting() {
    cy.get('.onboarding-stepper--desc').eq(1).contains('Connect to NetSuite Account')
    cy.get('.onboarding-stepper--check').eq(1).should('have.css', 'color', 'rgb(179, 186, 199)')
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
    cy.get('.onboarding-stepper--check').eq(2).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Select Subsidiary').click()
    cy.url().should('include', '/settings/configurations/subsidiary')
    cy.assertText('subsidiary-heading','Set up NetSuite Subsidiary.')
    cy.getElement('subsidiary-options').click().get('mat-option').contains('Honeycomb Mfg.').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(2).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function configurationSetting() {
    cy.get('.onboarding-stepper--desc').eq(3).contains('Map Fyle fields to NetSuite fields')
    cy.get('.onboarding-stepper--check').eq(3).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Go to Configurations').click()
    cy.url().should('include', '/settings/configurations/general')
    cy.get('.page-header--name').contains('Configurations')
    cy.getElement('employee-to-netsuite').click().get('mat-option').contains('Employee').click()
    cy.getElement('map-reimbursable-expense').click().get('mat-option').contains('Journal Entry').click()
    cy.getElement('ccc-expense').click().get('mat-option').contains('Bill').click()
    // cy.getElement('sync-payments').click().get('mat-option').contains('Import NetSuite Payments into Fyle').click()
    cy.getElement('employee-from-fyle').click().get('mat-option').contains('None').click()
    // cy.getElement('auto-create-employee').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.get('.cdk-overlay-container').contains('Configuration saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(3).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function bankAccountSetting() {
    cy.get('.onboarding-stepper--desc').eq(4).contains('Map Bank Accounts')
    cy.get('.onboarding-stepper--check').eq(4).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Go to General Mappings').click()
    cy.url().should('include', '/settings/general/mappings')
    cy.get('.page-header--name').contains('General Mappings')
    cy.getElement('NS-location').click().get('mat-option').contains('01: San Francisco').click()
    cy.getElement('NS-location-level').click().get('mat-option').contains('Transaction Body').click()
    cy.getElement('vendor-payable-account').click().get('mat-option').contains('Accounts Payable').click()
    cy.getElement('employee-payable-account').click().get('mat-option').contains('ABN Withholding').click()
    cy.getElement('default-ccc-account').click().get('mat-option').contains('California EDD').click()
    cy.getElement('save-btn').contains('Save').click()
    cy.get('.cdk-overlay-container').contains('General Mappings saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(4).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function ccSetting() {
    cy.get('.onboarding-stepper--desc').eq(4).contains('Map Corporate Cards')
    cy.get('.onboarding-stepper--check').eq(4).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Skip').click()
  }

  function employeeSetting() {
    cy.get('.onboarding-stepper--desc').eq(5).contains('Map Employees')
    cy.get('.onboarding-stepper--check').eq(5).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Go to Employee Mappings').click()
    cy.url().should('include', '/settings/employee/mappings')
    cy.get('.page-header--name').contains('Employee Mapping')
    cy.get('button').contains('Create Employee Mapping').click()
    cy.getElement('employee-model').children('div').eq(0).contains('Create New Mapping')
    cy.getElement('employee-value').get('input').eq(0).type('admin1')
    cy.getElement('fyle-employee-data').get('mat-autocomplete').get('mat-option').eq(0).click()
    cy.getElement('employee-value').get('input').eq(1).type('ashwin')
    cy.getElement('employee-value').get('mat-autocomplete').get('mat-option').eq(0).click()
    cy.getElement('employee-value').get('input').eq(1).should('have.value', 'Ashwin')
    cy.assertText('save-btn','Save')
    cy.getElement('save-btn').click()
    cy.getElement('employe-name-data').contains('Ashwin')
    cy.get('.cdk-overlay-container').contains('Employee Mapping saved successfully') 
    cy.navigateToModule('Dashboard') 
    cy.get('.onboarding-stepper--check__complete').eq(5).should('have.css', 'color', 'rgb(40, 195, 84)')
  }

  function categorySetting() {
    cy.get('.onboarding-stepper--desc').eq(6).contains('Map Categories')
    cy.get('.onboarding-stepper--check').eq(6).should('have.css', 'color', 'rgb(179, 186, 199)')
    cy.get('.onboarding-stepper--navigation').contains('Go to Category Mappings').click()
    cy.url().should('include', '/settings/category/mappings')
    cy.get('.page-header--name').contains('Category Mappings')
    cy.get('button').first().contains('Create Category Mapping').click()
    cy.getElement('edit-category-heading').contains('Create New Mapping')
    cy.get('input').eq(0).type('Train')
    cy.getElement('fyle-category-value').eq(0).click()
    cy.get('input').eq(1).type('Different Sub Account')
    cy.getElement('category-value').eq(0).click()
    cy.get('input').eq(1).should('have.value', 'Different Sub Account')
    cy.assertText('save-btn','Save')
    cy.getElement('save-btn').click()
    cy.get('.cdk-overlay-container').contains('Category Mapping saved successfully') 
    cy.url().should('include', '/dashboard') 
    cy.assertText('dashboard', 'Dashboard')
  }

  function importFromFyle() {
    cy.getElement('import').click()
    cy.url().should('include', '/sync_export/sync')
    cy.get('.page-header--name').contains('Import & Export')
    cy.getElement('import-btn').contains('Import').click()
    cy.getElement('import-btn').contains('Importing').should('to.be', 'disabled')
    cy.get('mat-progress-bar').should('to.be', 'visible') 
    cy.get('.cdk-overlay-container').contains('Import') 
  }

  function exportToNetsuite() {
    cy.getElement('export').click()
    cy.url().should('include', '/sync_export/export')
    cy.get('.export-header').contains('Export Expenses to NetSuite.')
    cy.getElement('export-btn').contains('Export').click()
    cy.getElement('export-btn').contains('Exporting').should('to.be', 'disabled')
    cy.get('mat-progress-bar').should('to.be', 'visible') 
    cy.get('.cdk-overlay-container').contains('Export') 
    cy.navigateToModule('Dashboard')
  }

  function resolveError() {
    let value;
    let tData, tCol, tRow;
    cy.navigateToModule('Expense Groups')
    cy.get('.page-header--name').contains('Expense Groups')
    cy.url().should('include', '/expense_group')
    cy.get('th').contains('Employee')
    cy.getElement('failed-data').eq(0).click()
    cy.url().should('include', '/view/info')
    cy.getElement('error-nav').contains('Mapping Errors').click()
    cy.url().should('include', '/view/mapping_errors')
    cy.get('td').then(($el) => {
      tData = $el.length
      cy.get('th').then(($ell) => {
        tCol = $ell.length
        tRow  = tData/tCol;
        if (tRow > 1) {
          for(var i = 0; i < tData; i=i+tCol) {
            cy.get('td').eq(i).click()
            cy.get('input').eq(0).then(($el) => {
                value = i == 0 ? 'Different Sub Account' : $el.val()[0]
                cy.get('input').eq(1).type(value)
                cy.getElement('category-value').eq(i).click()
                cy.assertText('save-btn','Save')
                cy.getElement('save-btn').click()
                cy.get('.cdk-overlay-container').contains('Category is mapped successfully, you can try re-exporting the failed entries') 
            })
          }
          cy.navigateToModule('Dashboard')
          exportToNetsuite()
          resolveError()
        }
        else if (tRow == 1) {
          cy.get('td').eq(0).contains('NetSuite System Error')
          cy.get('td').eq(1).contains('An error occured in a upsert request')
          cy.navigateToSettingPageItems('Category Mapping')
          cy.get('td').contains('Different Sub Account').click()
          cy.get('input').eq(2).clear()
          cy.get('input').eq(2).type('train')
          cy.getElement('category-value').eq(0).click()
          cy.get('input').eq(2).should('have.value', 'Train')
          cy.getElement('save-btn').click()
          cy.navigateToModule('Dashboard')
          cy.getElement('export').click()
          cy.wait(60000)
          cy.getElement('export-btn').contains('Export').click()
          cy.get('mat-progress-bar').should('to.be', 'visible') 
          cy.get('.cdk-overlay-container').contains('Export') 
          cy.navigateToModule('Expense Groups')
          cy.assertText('zero-state-description', 'You have no expense groups yet')
          cy.getElement('export-nav').contains('Complete').click()
          cy.url().should('include','/expense_groups?page_number=0&page_size=10&state=COMPLETE')
          cy.get('td').contains('admin1@fylefor')
        }
      })
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

    employeeSetting()

    categorySetting()

    importFromFyle()
    
    exportToNetsuite()

    resolveError()

  })
})
