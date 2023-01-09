/// <reference types="cypress" />

import environment from 'src/environments/environment.json';

describe('Auto Import and Export Setting', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Automated Import/Export')
    })

    function scheduleSet() {
        const schedule = {
            "id": 7,
            "enabled": true,
            "start_datetime": "2022-12-23T06:38:05.162701Z",
            "interval_hours": 1,
            "error_count": null,
            "additional_email_options": [
                {
                    "name": "Netsuite",
                    "email": "netsuite@gmail.com"
                },
            ],
            "emails_selected": [
                "netsuite@gmail.com",
                "admin1@fyleformicro.testing"
            ],
            "workspace": environment.e2e_tests.secret[1].workspace_id,
            "schedule": 14
        }
        cy.intercept('GET', '**/schedule/', schedule)
    }

    it('Auto Import and Export Setting', () => {
        cy.intercept('GET', '**/schedule/', {statusCode: 400, message: 'Schedule settings does not exist in workspace'})
        cy.intercept('POST', '**/schedule/', {statusCode: 400, message: 'Schedule settings does not exist in workspace'})
        cy.url().should('include', '/settings/schedule')
        cy.get('.schedule--header').contains('Automated Import/Export')
        cy.getElement('schedule-form').get('.schedule--header-title').eq(0).contains('Enable Automated Import-Export')
        cy.getElement('schedule-form').get('.schedule--header-info').contains('Set up an automatic process for importing expense groups')
        cy.getElement('schedule-form').get('.schedule--toggle').contains('Enable').click().should('to.be', 'cheked')
        cy.getElement('schedule-form').get('.schedule--header-title').eq(1).should('to.be', 'visible').contains('Select the frequency of the export')
        cy.getElement('schedule-frequency-data').should('to.be', 'visible')
        cy.getElement('schedule-frequency-data').click().get('mat-option').should('have.length', 24).eq(0).click()
        cy.getElement('schedule-frequency-data').focus().type('{esc}')
        cy.getElement('schedule-frequency-data').contains('1 hour')
        cy.getElement('schedule-form').get('.schedule--header-title').eq(2).should('to.be', 'visible').contains('Select an email address to notify upon export failure')
        cy.getElement('schedule-selected-email').should('to.be', 'visible')
        cy.getElement('schedule-selected-email').click().get('mat-option').eq(0).click()
        cy.getElement('schedule-selected-email').focus().type('{esc}')
        cy.getElement('schedule-selected-email').contains('@')
        cy.getElement('add-email').contains('Add new email address').click()
        cy.getElement('add-email-form').should('to.be', 'visible')
        cy.get('.mat-title').contains('Add new Email Address')
        cy.get('.admin-info').contains('Add an email address on which you would like to recieve your integration notifcation mails.')
        cy.getElement('add-email-form').get('input').eq(1).type('Netsuite')
        cy.getElement('add-email-form').get('input').eq(2).type('netsuite@gmail.com')
        cy.getElement('btn-cnl-save').get('button').eq(1).contains('Cancel')
        cy.getElement('btn-cnl-save').get('button').eq(2).contains('Add and Save').click()
        cy.getElement('save-btn').contains('Save').click()
        scheduleSet()
        cy.get('.cdk-overlay-container').contains('Schedule saved') 
    })
})