import { Given,When, Then } from "cypress-cucumber-preprocessor/steps";
 
Given('I am working with mocks', () => {
  cy.server()
})

Given('repositories are mocked', () => {
  cy.route({
    method: 'POST',     
    url: '/getRepositories',    
    response: [{"name":"dev-process-analysis","location":"~/want-to-build"},
    {"name":"card-game","location":"~/card-game"},{"name":"mock-repository","location":"mock/location"}]        //
  })
})

Given('commitments are mocked', () => {
  cy.route({
    method: 'POST',     
    url: '/getCommitments',    
    response: [{"message":"my first commit","ID":"0"},
    {"message":"my second commitment","ID":"1"},
    {"message":"my third commit","ID":"3"}]        
  })
})

Given('diffs are mocked', () => {
  cy.route({
    method: 'POST',     
    url: '/getDiffs',    
    response: [{"path":"~/dev/myChange/file_B.py","change_type":"A"},
    {"path":"~/dev/myChange/file_A.py","change_type":"M"}]        
  })
})

When('I open the app', () => {
  cy.visit('http://localhost:3000')
})

When('I load commitments', () => {
  cy.findAllByText("Load Commitments").click()
})

When('I select the repository {string}', (repositoryName) => {
  cy.findAllByText("Select a repository").get('select').select(repositoryName)
})

When('I select the commitment {string}', (commitmentDescription) => {
  cy.get('.commits').findAllByText(commitmentDescription).click()
})

When('I select the diff {string}', (diffDescription) => {
  cy.get('.diffs').findAllByText(diffDescription).click()
})


When('I click the {string} button', (buttonText) => {
  cy.findAllByText(buttonText).click()
})

Then('I see the {string} button', (buttonText) => {
  cy.findAllByText(buttonText).should('exist')
})