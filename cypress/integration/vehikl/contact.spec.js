describe('Contact Page', () => {
  const email = 'c.decarlo@vehikl.com'
  const comments =
    'Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.'
  const successMessage =
    'Thank your for reaching out to Vehikl. We’ll review your inquiry and respond to you soon.'

  beforeEach(() => {
    cy.server({
      method: 'POST',
      delay: 1000,
      status: 200,
      response: {}
    })
  })

  it('should submit a contact message', () => {
    cy.visit('https://vehikl.com/')
    cy.route('POST', '/api/messages').as('postMessage')

    cy.get('a').contains("Let's work together").click().url().should('include', '/contact')

    cy.get('[id="name"]').type('Colin DeCarlo').should('have.value', 'Colin DeCarlo')
    cy.get('[type="email"]').type(email).should('have.value', email)
    cy.get('#Comments').type(comments).should('have.value', comments)

    cy.get('button').contains('Submit').click()
    cy.get('button').contains('Loading...').should('be.visible')

    cy.get('.confirmation-modal').contains(successMessage).should('contain.text', successMessage)

    cy.get('.confirmation-modal').contains('close').click()

    cy.get('[id="name"]').should('be.empty')
    cy.get('[type="email"]').should('be.empty')
    cy.get('#Comments').should('be.empty')
  })
})
