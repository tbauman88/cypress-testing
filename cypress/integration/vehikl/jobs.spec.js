import 'cypress-file-upload'

describe('Vehikl Jobs', () => {
  const message =
    'Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.'

  const applicationInput = {
    email: 'c.decarlo@vehikl.com',
    location: 'London',
    message,
    name: 'Colin DeCarlo',
    position: 'Full Stack Developer',
    resume: null
  }

  beforeEach(() => {
    cy.server({ method: 'POST', delay: 1000, status: 200, response: applicationInput })
  })

  it('should apply to the Full Stack Developer position', () => {
    cy.route('POST', '/api/job-applications').as('postApplication')
    cy.visit('/jobs')

    cy.get('a')
      .contains('Full Stack Developer')
      .click()
      .url()
      .should('include', 'full-stack-developer')

    cy.get('#Waterloo').parent().click()
    cy.get('#Waterloo').should('be.checked')

    cy.get('#Hamilton').parent().click()
    cy.get('#Hamilton').should('be.checked')

    cy.get('#London').parent().click()
    cy.get('#London').should('be.checked')

    cy.get('[id="name"]').type(applicationInput.name).should('have.value', 'Colin DeCarlo')

    cy.get('[type="email"]')
      .type(applicationInput.email)
      .should('have.value', 'c.decarlo@vehikl.com')

    cy.get('#Comments').type(applicationInput.message).should('have.value', message)

    cy.get('[type="file"]').attachFile('resume.pdf')

    cy.get('button').contains('Submit').click()

    cy.wait('@postApplication')
      .its('request.body')
      .should((formData) => {
        const formDataObject = {}
        formData.forEach((value, key) => (formDataObject[key] = value))

        // FormData converts null to a string
        expect(formDataObject).to.eql({ ...applicationInput, resume: 'null' })
      })

    cy.get('.confirmation-modal')
      .contains('Hello Colin DeCarlo')
      .should('contain.text', 'Hello Colin DeCarlo')

    cy.get('@postApplication').its('responseBody').should('deep.equal', applicationInput)

    cy.get('@postApplication')
      .its('response.body')
      .should('not.deep.equal', { ...applicationInput, name: 'Attila Komarmoi' })
  })
})
