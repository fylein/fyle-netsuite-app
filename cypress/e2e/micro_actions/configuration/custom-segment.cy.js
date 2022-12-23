/// <reference types="cypress" />

describe('custom segment', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Configurations')
    })

    it('Expense feild', () => {
        cy.getElement('tab-nav').contains('NetSuite Expense Fields').click()
        cy.url().should('include', '/settings/configurations/custom_segments')
        cy.getElement('custom-segment-header').contains('Add Custom List / Record / Segment items from Netsuite.')
        cy.getElement('add-btn').contains('Add Custom List / Record / Segment').click()
        cy.getElement('model-header').should('to.be', 'visible').contains('Add Custom List / Record / Segment')
        cy.getElement('segment-form').get('.mappings-dialog--label').eq(0).contains('Enter NetSuite Script Id')
        cy.getElement('segment-form').get('input').eq(0).type('netsuite-123')
        cy.getElement('segment-form').get('.mappings-dialog--label').eq(1).contains('Enter Custom Record / Field / Segment Internal Id')
        cy.getElement('segment-form').get('input').eq(1).type('netsuite-123')
        cy.getElement('segment-form').get('.mappings-dialog--label').eq(2).contains('Choose Custom Field Type')
        cy.getElement('segment-form').get('mat-select').click().get('mat-option').should('have.length', 3).eq(0).click()
        cy.assertText('save-btn', 'Save')
        cy.getElement('save-btn').click()
        cy.get('.cdk-overlay-container').contains('Invalid Custom Record fields, please try again') 
        cy.assertText('cancel-btn', 'Cancel')
        cy.getElement('cancel-btn').click()
        cy.assertText('zero-state-description', 'You have no custom lists / records yet')
    })
})