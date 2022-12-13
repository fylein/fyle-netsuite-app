/// <reference types="cypress" />

describe('logout', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
  })

  it('logout the user', () => {
    cy.url().should('include', '/dashboard')
    cy.assertText('ns-user-name', 'Theresa Brown')
    cy.getElement('log-down-arrow').click()
    cy.assertText('logout-btn', 'Sign Out')
    cy.getElement('logout-btn').click()
    cy.url().should('include', '/auth/login')
  })
})
