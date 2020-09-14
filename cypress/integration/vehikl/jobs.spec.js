import 'cypress-file-upload'

describe('Vehikl Jobs', () => {
  const comments =
    'Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.'

  beforeEach(() => {
    cy.server({
      method: 'POST',
      delay: 1000,
      status: 200,
      response: {}
    })
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

    cy.get('[id="name"]').type('Colin DeCarlo').should('have.value', 'Colin DeCarlo')

    cy.get('[type="email"]')
      .type('c.decarlo@vehikl.com')
      .should('have.value', 'c.decarlo@vehikl.com')

    cy.get('#Comments').type(comments).should('have.value', comments)

    cy.get('[type="file"]').attachFile('resume.pdf')

    cy.get('button').contains('Submit').click()

    cy.get('.confirmation-modal')
      .contains('Hello Colin DeCarlo')
      .should('contain.text', 'Hello Colin DeCarlo')
  })
})
