/// <reference types="cypress" />

describe('Memo', () => {
    beforeEach(() => {
        cy.microActionsLogin()
        cy.visit('/')
        cy.navigateToSettingPageItems('Configurations')
    })

    function reset() {
        cy.getElement('memo-data').click()
        cy.getElement('memo-data').get('mat-option').should('have.length', 6)
        cy.getElement('memo-data').get('mat-option').contains('Employee Email').click().should('to.be', 'cheked')
        cy.getElement('memo-data').focus().type('{esc}')
        cy.getElement('save-btn').click()
    }
    
    it('Update memo setting', () => {
        cy.getElement('tab-nav').contains('Modify Memo').click()
        cy.url().should('include', '/settings/configurations/memo_structure')
        cy.assertText('memo-header', 'Customize the data set you would like to pass to the memo field of NetSuite while exporting expenses from Fyle.')
        cy.assertText('memo-sub-header', 'Select and reorder the fields')
        cy.getElement('memo-data').click()
        cy.getElement('memo-data').get('mat-option').should('have.length', 6)
        cy.getElement('memo-data').get('mat-option').contains('Employee Email').click().should('not.to.be', 'cheked')
        cy.getElement('memo-data').focus().type('{esc}')
        cy.getElement('memo-preview').get('.info-box-text').then(($el) => {
            const preview = $el[0].innerHTML.split(">")[1]
            const actualValue = " Meals and Entertainment - Pizza Hut - " + new Date().toLocaleDateString() + " - C/2021/12/R/1 - Client Meeting "
            expect(preview).to.equal(actualValue)
        })
        // contains(' Meals and Entertainment - Pizza Hut - 22/12/2022 - C/2021/12/R/1 - Client Meeting ')
        cy.assertText('save-btn', 'Save')
        cy.getElement('save-btn').click()
        cy.get('.cdk-overlay-container').contains('Custom Memo saved successfully') 
        reset()
    })
})