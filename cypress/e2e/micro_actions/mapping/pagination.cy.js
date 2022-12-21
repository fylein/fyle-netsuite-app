/// <reference types="cypress" />

describe('pagination', () => {
  beforeEach(() => {
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToSettingPageItems('Employee Mapping')
  })

  it('Pagination test', () => {
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
  })
})
