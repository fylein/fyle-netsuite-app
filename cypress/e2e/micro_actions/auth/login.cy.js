/// <reference types="cypress" />

describe('shared login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should redirect user back to login page', () => {
    cy.url().should('include', '/auth/login')
    cy.assertText('ns-title','Fyle NetSuite Integration')
    cy.assertText('login-btn','Sign in with FYLE')
    cy.getElement('login-btn').click()
    cy.origin('https://app.fyle.tech', () => {
      cy.get('p').first().contains('Integration would like to access your Fyle Account')
    })
  })
})
