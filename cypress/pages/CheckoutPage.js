class CheckoutPage {
  elements = {
    billingFirstName: () => cy.get('#billing_first_name'),
    billingLastName: () => cy.get('#billing_last_name'),
    billingAddress: () => cy.get('#billing_address_1'),
    billingCity: () => cy.get('#billing_city'),
    billingState: () => cy.get('#billing_state'),
    billingPostcode: () => cy.get('#billing_postcode'),
    billingPhone: () => cy.get('#billing_phone'),
    billingEmail: () => cy.get('#billing_email'),
    placeOrderButton: () => cy.get('#place_order'),
    orderReceivedTitle: () => cy.get('.woocommerce-notice--success'),
    paymentMethod: () => cy.get('#payment_method_cod')
  }

  visit() {
    cy.visit('/checkout/')
  }

  fillBillingDetails(billingData) {
    this.elements.billingFirstName().clear().type(billingData.firstName)
    this.elements.billingLastName().clear().type(billingData.lastName)
    this.elements.billingAddress().clear().type(billingData.address)
    this.elements.billingCity().clear().type(billingData.city)
    this.elements.billingState().select(billingData.state)
    this.elements.billingPostcode().clear().type(billingData.postcode)
    this.elements.billingPhone().clear().type(billingData.phone)
    this.elements.billingEmail().clear().type(billingData.email)
  }

  selectPaymentMethod() {
    this.elements.paymentMethod().click()
  }

  placeOrder() {
    this.elements.placeOrderButton().click()
  }

  // Verificações
  verifyOrderSuccess() {
    this.elements.orderReceivedTitle().should('contain', 'Obrigado. Seu pedido foi recebido.')
  }
}

export default CheckoutPage
