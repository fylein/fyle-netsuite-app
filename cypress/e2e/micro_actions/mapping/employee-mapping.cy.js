/// <reference types="cypress" />

describe('Employee Mapping', () => {
    beforeEach(() => {
      cy.microActionsLogin()
      cy.visit('/')
    })

    function reset() {
      cy.getElement('employe-email-data').eq(0).click()
      cy.getElement('employee-value').get('input').eq(2).clear()
      cy.getElement('employee-value').get('input').eq(2).type('Theresa Brown')
      cy.getElement('employee-value').get('mat-autocomplete').get('mat-option').eq(0).click()
      cy.getElement('save-btn').click()
    }
  
    it('update employee mapping', () => {
        cy.navigateToSettingPageItems('Employee Mapping')
        cy.get('.page-header--name').contains('Employee Mapping')
        cy.url().should('include', '/settings/employee/mappings')
        cy.get('button').first().contains('Create Employee Mapping')
        cy.get('button').eq(1).contains('Refresh Employee Mappings')
        cy.getElement('employe-email').contains('Employee Email')
        cy.getElement('employe-name').contains('Employee Name')
        cy.getElement('employe-email-data').eq(0).contains('admin1@fyleformicro.testing')
        cy.getElement('employe-name-data').eq(0).contains('Theresa Brown')
        cy.getElement('employe-email-data').eq(0).click()
        cy.getElement('employee-model').children('div').eq(0).contains('Edit Employee Mapping')
        cy.getElement('employee-value').get('input').eq(2).clear()
        cy.getElement('employee-value').get('input').eq(2).type('ashwin')
        cy.getElement('employee-value').get('mat-autocomplete').get('mat-option').eq(0).click()
        cy.getElement('employee-value').get('input').eq(2).should('have.value', 'Ashwin')
        cy.assertText('save-btn','Save')
        cy.getElement('save-btn').click()
        cy.getElement('employe-name-data').eq(0).contains('Ashwin')
        reset()
    })
  })
  