/// <reference types="cypress" />

describe('auth module', () => {
  beforeEach(() => {
    cy.microActionsLogin()
    cy.visit('/')
  })

  it('should load auth module', () => {
    cy.visit('/auth')
  })

  it('Netsuite Token expired', () => {
    cy.intercept('GET', '**/credentials/netsuite/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message',
      },
    })
    cy.reload()

    cy.url().should('include', '/dashboard')
  })
})
