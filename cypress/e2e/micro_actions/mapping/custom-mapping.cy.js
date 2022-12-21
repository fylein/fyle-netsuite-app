/// <reference types="cypress" />

describe('Custom Mapping', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Cost Center Mappings')
    })
  
    function reset() {
        cy.getElement('custom-table-fyle-value').eq(0).click()
        cy.getElement('custom-netsuite-value').get('input').eq(2).clear()
        cy.getElement('custom-netsuite-value').get('input').eq(2).type('Consumer Goods')
        cy.getElement('custom-netsuite-value').get('mat-autocomplete').get('mat-option').eq(0).click()
        cy.getElement('save-btn').click()
    }

    it('Pagination test', () => {
        cy.get('.page-header--name').contains('Cost Center Mappings')
        cy.url().should('include', '/settings/cost_center/mappings')
        cy.get('button').first().contains('New Cost Center Mapping')
        cy.getElement('custom-table-fyle-header').contains('Cost Center')
        cy.getElement('custom-table-netsuite-header').contains('NetSuite Class')
        cy.getElement('custom-table-fyle-value').eq(0).contains('Corporate')
        cy.getElement('custom-table-netsuite-value').eq(0).contains('Consumer Goods')
        cy.getElement('custom-table-fyle-value').eq(0).click()
        cy.getElement('custom-header').children('div').eq(0).contains('Edit Cost Center Mapping')
        cy.getElement('custom-netsuite-value').get('input').eq(2).clear()
        cy.getElement('custom-netsuite-value').get('input').eq(2).type('Accessories')
        cy.getElement('custom-netsuite-value').get('mat-autocomplete').get('mat-option').eq(0).click()
        cy.getElement('custom-netsuite-value').get('input').eq(2).should('have.value', 'Accessories')
        cy.assertText('save-btn','Save')
        cy.getElement('save-btn').click()
        cy.getElement('custom-table-netsuite-value').eq(0).contains('Accessories')
        reset()
    })
  })
  