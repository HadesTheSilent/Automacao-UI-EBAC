class ProductPage {
  elements = {
    productLink: (productName) => cy.contains('.product_title', productName),
    addToCartButton: () => cy.get('.single_add_to_cart_button'),
    viewCartLink: () => cy.get('.woocommerce-message > .button'),
    productSize: (size) => cy.contains('.button-variable-item', size),
    productColor: (color) => cy.contains('.button-variable-item', color)
  }

  visitProduct(productUrl) {
    cy.visit(productUrl)
  }

  selectSize(size) {
    this.elements.productSize(size).click()
  }

  selectColor(color) {
    this.elements.productColor(color).click()
  }

  addToCart() {
    this.elements.addToCartButton().click()
  }

  goToCart() {
    this.elements.viewCartLink().click()
  }
}

export default ProductPage
