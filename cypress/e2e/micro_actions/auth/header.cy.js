/// <reference types="cypress" />

describe('header', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
  })

  function assertPageHeader(pageName) {
    if(pageName === 'Automated Import/Export') {
      cy.get('.schedule--header').contains(pageName)
    }
    else {
      cy.get('.page-header--name').contains(pageName)
    }
  }

  it('header elements check', () => {
    // const cred = {
    //   created_at: "2022-12-12T07:51:34.985642Z",
    //   id: 2,
    //   ns_account_id: "TSTDRV2089588",
    //   updated_at: "2022-12-12T07:51:34.985654Z",
    //   workspace_id: 2
    // }
    // cy.intercept('GET', '**/credentials/netsuite/', cred) 

    cy.url().should('include', '/dashboard')
    cy.assertText('dashboard', 'Dashboard')

    cy.navigateToModule('Import & Export')
    assertPageHeader('Import & Export')

    cy.navigateToModule('Expense Groups')
    assertPageHeader('Expense Groups')

    cy.navigateToSettingPageItems('Configuration')
    assertPageHeader('Configurations')

    cy.navigateToSettingPageItems('Configuration')
    assertPageHeader('Configurations')

    cy.navigateToSettingPageItems('General Mappings')
    assertPageHeader('General Mappings')

    cy.navigateToSettingPageItems('Employee Mapping')
    assertPageHeader('Employee Mapping')

    cy.navigateToSettingPageItems('Category Mapping')
    assertPageHeader('Category Mapping')

    cy.navigateToSettingPageItems('Automated Import/Export')
    assertPageHeader('Automated Import/Export')
    
  })

})
