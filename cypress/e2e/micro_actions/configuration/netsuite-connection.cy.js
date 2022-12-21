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
        cy.assertText('zero-state-btn','Update NetSuite Connection')
        cy.getElement('zero-state-btn').click()
        cy.assertText('connect-netsuite-header','Connect to your NetSuite account to start exporting expense data from Fyle.')
        cy.getElement('connect-netsuite-form').get('.mappings-dialog--label').first().contains('NetSuite Account ID')
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(0).then(($el) => {
            assert.equal($el[0].value,environment.e2e_tests.secret[1].ns_account_id)
        })
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(1).then(($el) => {
            assert.equal($el[0].value,'')
        })
        cy.getElement('connect-netsuite-form').get('.mat-input-element').eq(2).then(($el) => {
            expect($el).not.to.be.empty
        })
        cy.getElement('save-btn').then(($el) => {
            expect($el).to.be.disabled
        })
    })
  
  })
  