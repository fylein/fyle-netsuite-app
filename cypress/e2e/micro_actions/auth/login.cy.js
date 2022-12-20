/// <reference types="cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should redirect user back to login page', () => {
    cy.url().should('include', '/auth/login')
    cy.assertText('ns-title','Fyle NetSuite Integration')
    cy.assertText('login-btn','Sign in with FYLE')
  })
})
