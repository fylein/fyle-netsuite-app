/// <reference types="cypress" />

describe('auth module', () => {
  beforeEach(() => {
    cy.microActionsLogin()
    cy.visit('/')
  })

  it('Netsuite Token expired', () => {
    cy.intercept('GET', '**/configuration/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message',
      },
    })
    cy.reload()

    cy.url().should('include', '/dashboard')
  })
})
