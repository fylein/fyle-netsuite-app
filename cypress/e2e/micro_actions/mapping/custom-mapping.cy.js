/// <reference types="cypress" />

describe('Cost Center Mapping', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Cost Center Mappings')
    })
  
    function reset(value) {
        cy.getElement('custom-table-fyle-value').eq(0).click()
        cy.getElement('custom-netsuite-value').get('input').eq(2).clear()
        cy.getElement('custom-netsuite-value').get('input').eq(2).type(value)
        cy.getElement('custom-netsuite-value').get('mat-autocomplete').get('mat-option').eq(0).click()
        cy.getElement('save-btn').click()
    }

    it('Update cost center mapping', () => {
        cy.get('.page-header--name').contains('Cost Center Mappings')
        cy.url().should('include', '/settings/cost_center/mappings')
        cy.get('button').first().contains('New Cost Center Mapping')
        cy.getElement('custom-table-fyle-header').contains('Cost Center')
        cy.getElement('custom-table-netsuite-header').contains('NetSuite Class')
        cy.getElement('custom-table-fyle-value').eq(0).click()
        cy.getElement('custom-header').children('div').eq(0).contains('Edit Cost Center Mapping')
        cy.getElement('custom-netsuite-value').get('input').eq(2).then(($input) => {
            const value = $input[0].value
            cy.getElement('custom-netsuite-value').get('input').eq(2).clear()
            cy.getElement('custom-netsuite-value').get('input').eq(2).type('fyle')
            cy.getElement('custom-netsuite-value').get('mat-option').eq(0).click()
            cy.assertText('save-btn','Save')
            cy.getElement('save-btn').click()
            cy.getElement('custom-table-netsuite-value').eq(0).contains('Ashu')
            reset(value)
        })
    })
  })
  