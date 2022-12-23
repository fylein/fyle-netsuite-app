/// <reference types="cypress" />

describe('Expense Feild', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Configurations')
    })

    function perGetFyleExpenseField() {
        const fyleFields = [{"attribute_type":"COST_CENTER","display_name":"Cost Center"},{"attribute_type":"PROJECT","display_name":"Project"}]
        cy.intercept('GET', '**/fyle/fyle_fields/', fyleFields)
    }

    function postGetFyleExpenseField() {
        const fyleFields = [{"attribute_type":"COST_CENTER","display_name":"Cost Center"},{"attribute_type":"PROJECT","display_name":"Project"},{"attribute_type":"FOOD","display_name":"Food"}]
        cy.intercept('GET', '**/fyle/fyle_fields/', fyleFields)
    }

    it('Expense feild', () => {
        perGetFyleExpenseField()
        cy.getElement('tab-nav').contains('Expense Fields').click()
        cy.url().should('include', '/settings/configurations/expense_fields')
        cy.getElement('expense-feild-header').eq(0).contains('Please map Netsuite fields to a Fyle equivalent. You can either map fields from NetSuite to an existing field in Fyle or can create new Fyle field.')
        cy.getElement('expense-fields-sub-heading').children().eq(0).contains('NetSuite Fields')
        cy.getElement('expense-fields-sub-heading').children().eq(2).contains('Fyle Fields')
        cy.getElement('expense-fields-sub-heading').children().eq(3).contains('Import to Fyle')
        cy.getElement('add-btn').contains('Add another field').click()
        cy.getElement('netsuite-feild-data').eq(1).click().get('mat-option').eq(1).click()
        cy.getElement('fyle-feild-data').eq(1).click().get('mat-option').eq(1).click()
        cy.assertText('save-btn', 'Save')
        cy.getElement('save-btn').click()
        cy.get('.cdk-overlay-container').contains('Expense Fields mapping saved successfully') 
        cy.getElement('add-btn').contains('Add another field').click()
        cy.getElement('netsuite-feild-data').eq(2).click().get('mat-option').eq(2).click()
        cy.getElement('fyle-feild-data').eq(2).click().get('mat-option').contains('Create Fyle Expense field').click()
        cy.getElement('custom-feild').should('to.be', 'visible').contains('Add a custom field')
        cy.getElement('custom-feild').get('input').last().type('Food')
        cy.getElement('custom-feild').get('button').eq(1).contains('Done').click()
        cy.assertText('save-btn', 'Save')
        cy.getElement('save-btn').click()
        postGetFyleExpenseField()
        cy.get('.cdk-overlay-container').contains('Expense Fields mapping saved successfully') 
        cy.get('.mat-slide-toggle-label').eq(2).should('to.be', 'checked')
    })
})