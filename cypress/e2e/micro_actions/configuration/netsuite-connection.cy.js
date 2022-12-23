/// <reference types="cypress" />
import environment from 'src/environments/environment.json';

describe('Netsuite connection', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Connect to NetSuite')
    })
    
    it('Update netsuite connection', () => {
        cy.url().should('include', '/settings/netsuite')
        cy.get('.page-header--name').contains('NetSuite Connection')
        cy.assertText('zero-state-description', 'You have connected to your NetSuite Account already')
        cy.assertText('zero-state-btn','Update NetSuite Connection')
        cy.getElement('zero-state-btn').click()
        cy.assertText('connect-netsuite-header','Connect to your NetSuite account to start exporting expense data from Fyle.')
        cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').first().contains('NetSuite Account ID')
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(0).then(($el) => {
            expect($el[0].value).equal(environment.e2e_tests.secret[1].ns_account_id)
        })
        cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').eq(1).contains('NetSuite Token ID')
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(1).then(($el) => {
            assert.equal($el[0].value,'')
        })
        cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').eq(2).contains('NetSuite Token Secret')
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(2).then(($el) => {
            expect($el).to.be.empty
        })
        cy.assertText('save-btn', 'Save')
        cy.getElement('save-btn').then(($el) => {
            expect($el).to.be.disabled
        })
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
    })
  
  })
  