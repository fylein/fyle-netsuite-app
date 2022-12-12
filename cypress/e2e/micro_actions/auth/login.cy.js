/// <reference types="cypress" />

describe('shared login', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
  })

  it('should redirect user back to login page', () => {
    cy.visit('/auth/shared_login?local_storage_dump={"workspaceId": "2"}')
    cy.url().should('include', '/auth/login')
    cy.assertText('ns-title','Fyle NetSuite Integration')
    cy.assertText('login-btn','Sign in with FYLE')
    cy.getElement('login-btn').click()
    cy.origin('https://app.fyle.tech', () => {
      cy.get('p').first().contains('Integration would like to access your Fyle Account')
    })
  })
})
