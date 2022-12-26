/// <reference types="cypress" />

describe('Category mapping', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
    })

    function reset(value) {
        cy.getElement('category-fyle-data').first().click()
        cy.get('input').eq(2).clear()
        cy.get('input').eq(2).type(value)
        cy.getElement('category-value').eq(0).click()
        cy.getElement('save-btn').click()
    }
  
    it('Update Category Mapping', () => {
        cy.navigateToSettingPageItems('Category Mapping')
        cy.get('.page-header--name').contains('Category Mapping')
        cy.url().should('include', '/settings/category/mappings')
        cy.get('button').first().contains('Create Category Mapping')
        cy.get('th').first().contains('Category')
        cy.get('th').eq(1).contains('Netsuite Account')
        cy.getElement('category-fyle-data').first().click()
        cy.getElement('edit-category-heading').contains('Edit Category Mapping')
        cy.get('input').eq(2).then(($input) => {
            const previousValue = $input[0].value
            const currentValue = previousValue === 'CAD' ? 'Food' : 'CAD'
            cy.get('input').eq(2).clear()
            cy.get('input').eq(2).type(currentValue)
            cy.getElement('category-value').eq(0).click()
            cy.get('input').eq(2).should('have.value', currentValue)
            cy.assertText('save-btn','Save')
            cy.getElement('save-btn').click()
            cy.getElement('category-ns-data').eq(0).contains(currentValue)
            reset(previousValue)  
        })
    })
  
  })
  