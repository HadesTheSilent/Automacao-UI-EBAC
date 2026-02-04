class CartPage {
  elements = {
    cartTable: () => cy.get('.cart_item'),
    productName: () => cy.get('.product-name'),
    productPrice: () => cy.get('.product-price'),
    productQuantity: () => cy.get('.product-quantity'),
    subtotal: () => cy.get('.cart-subtotal .woocommerce-Price-amount'),
    total: () => cy.get('.order-total .woocommerce-Price-amount'),
    proceedToCheckoutButton: () => cy.get('.checkout-button'),
    quantityInput: () => cy.get('.input-text.qty'),
    updateCartButton: () => cy.get('[name="update_cart"]'),
    removeProductButton: () => cy.get('.remove')
  }

  visit() {
    cy.visit('/carrinho/')
  }

  updateQuantity(quantity) {
    this.elements.quantityInput().clear().type(quantity)
    this.elements.updateCartButton().click()
  }

  proceedToCheckout() {
    this.elements.proceedToCheckoutButton().click()
  }

  removeProduct() {
    this.elements.removeProductButton().first().click()
  }

  verifyProductInCart(productName) {
    this.elements.productName().should('contain', productName)
  }

  verifyCartTotal(expectedTotal) {
    this.elements.total().should('contain', expectedTotal)
  }

  verifyCartNotEmpty() {
    this.elements.cartTable().should('have.length.greaterThan', 0)
  }
}

export default CartPage
