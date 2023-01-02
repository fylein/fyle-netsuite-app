/// <reference types="cypress" />

describe('pagination', () => {
  beforeEach(() => {
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToSettingPageItems('Employee Mapping')
  })

  it('Pagination test', () => {
    cy.intercept('GET', '**/mappings/employee/**', {fixture: 'employee.json'})
    cy.get('.page-header--name').contains('Employee Mapping')
    cy.assertText('paginator','50')
    cy.get('.mat-select-value').click()
    cy.get('mat-option').eq(1).contains('100')
    cy.get('mat-option').eq(2).contains('200')
    cy.get('mat-option').eq(3).contains('500')
    cy.get('mat-option').eq(2).contains('200').click()
    cy.assertText('paginator','200')
    cy.get('.mat-select-value').click()
    cy.get('mat-option').eq(0).contains('50').click()
    cy.get('.mat-paginator-range-label').contains('1 – 50 of 110')
    cy.get('.mat-paginator-icon').eq(2).click()
    cy.get('.mat-paginator-range-label').contains('51 – 100 of 110')
    cy.get('.mat-paginator-icon').eq(1).click()
    cy.get('.mat-paginator-range-label').contains('1 – 50 of 110')
    cy.get('.mat-paginator-icon').eq(3).click()
    cy.get('.mat-paginator-range-label').contains('101 – 110 of 110')
    cy.get('.mat-paginator-icon').eq(0).click()
    cy.get('.mat-paginator-range-label').contains('1 – 50 of 110')
  })
})
