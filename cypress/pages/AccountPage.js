class AccountPage {
  elements = {
    myAccountMenu: () => cy.get('.icon-user-unfollow'),
    registerEmailField: () => cy.get('#reg_email'),
    registerPasswordField: () => cy.get('#reg_password'),
    registerButton: () => cy.get(':nth-child(4) > .button'),
    errorMessage: () => cy.get('.woocommerce-error'),
    myAccountTitle: () => cy.contains('Minha conta'),
    dashboardMessage: () => cy.get('.woocommerce-MyAccount-content > :nth-child(2)')
  }

  visit() {
    cy.visit('/minha-conta/')
  }

  fillRegistrationEmail(email) {
    this.elements.registerEmailField().clear().type(email)
  }

  fillRegistrationPassword(password) {
    this.elements.registerPasswordField().clear().type(password)
  }

  clickRegisterButton() {
    this.elements.registerButton().click()
  }

  registerNewAccount(email, password) {
    this.fillRegistrationEmail(email)
    this.fillRegistrationPassword(password)
    this.clickRegisterButton()
  }

  verifySuccessfulRegistration() {
    this.elements.dashboardMessage().should('contain', 'Olá')
  }

  verifyErrorMessage(message) {
    this.elements.errorMessage().should('contain', message)
  }

  verifyRequiredFieldError() {
    this.elements.errorMessage().should('be.visible')
  }
}

export default AccountPage
