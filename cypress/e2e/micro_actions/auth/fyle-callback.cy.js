/// <reference types="cypress" />
import environment from 'src/environments/environment.json';
describe('fyle callback', () => {
  beforeEach(() => {})

  it('should redirect user back to login page', () => {
    cy.visit('/auth/callback?code=xyz')
    cy.url().should('include', '/auth/login')
  })

  it('should login the user', () => {
    const token = {
      access_token: environment.e2e_tests.secret[1].access_token,
      refresh_token: environment.e2e_tests.secret[1].refresh_token,
      user: {
        email: 'admin1@fyleformicro.testing',
        full_name: 'Theresa Brown',
        org_id: 'orCzSo3tGtxQ',
        org_name: 'Fyle For netsuiteMicroActiontesting'
      }
    };
    cy.intercept('POST', '**/auth/login/', token)
    cy.intercept('GET', '**/workspaces/?org_id=**', [1])
    cy.intercept('GET', '**/credentials/netsuite/', {})
    cy.intercept('GET', '**/mappings/settings/', {})
    cy.visit('/auth/callback?code=xyz')

    cy.url().should('include', '/workspaces')
  })
})
