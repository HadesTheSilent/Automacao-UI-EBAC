Cypress.Commands.add('login', (username, password) => {
  cy.visit('/minha-conta/')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('.woocommerce-form > .button').click()
  
  cy.get('body').then(($body) => {
    if ($body.find('.woocommerce-error').length > 0) {
      cy.log('AVISO: Falha de login com as credenciais fornecidas')
    }
  })
})

Cypress.Commands.add('addProductToCart', (productUrl, size = null, color = null, quantity = 1) => {
  cy.visit(productUrl)
  
  if (size) {
    cy.contains('.button-variable-item', size).click()
  }
  
  if (color) {
    cy.contains('.button-variable-item', color).click()
  }
  
  if (quantity > 1) {
    cy.get('.input-text.qty').clear().type(quantity)
  }
  
  cy.get('.single_add_to_cart_button').click()
  cy.get('.woocommerce-message').should('be.visible')
})

Cypress.Commands.add('clearCart', () => {
  cy.visit('/carrinho/')
  cy.get('body').then(($body) => {
    if ($body.find('.cart_item').length > 0) {
      cy.get('.remove').each(($el) => {
        cy.wrap($el).click()
      })
    }
  })
})

Cypress.Commands.add('completeCheckout', (billingData) => {
  cy.visit('/checkout/')
  
  cy.get('#billing_first_name').clear().type(billingData.firstName)
  cy.get('#billing_last_name').clear().type(billingData.lastName)
  cy.get('#billing_address_1').clear().type(billingData.address)
  cy.get('#billing_city').clear().type(billingData.city)
  cy.get('#billing_state').select(billingData.state, { force: true })
  cy.get('#billing_postcode').clear().type(billingData.postcode)
  cy.get('#billing_phone').clear().type(billingData.phone)
  cy.get('#billing_email').clear().type(billingData.email)
  
  cy.get('input[name="terms"]').check({ force: true })
  
  cy.get('#payment_method_cod').click()
  cy.get('#place_order').click()
})

Cypress.Commands.add('addToCartAndGoToCart', (productUrl, size = null, color = null) => {
  cy.addProductToCart(productUrl, size, color)
  cy.get('.woocommerce-message > .button').click()
})

Cypress.Commands.add('verifyProductInCart', (productName) => {
  cy.get('.product-name').should('contain', productName)
})

Cypress.Commands.add('verifyCartTotal', (expectedTotal) => {
  cy.get('.order-total .woocommerce-Price-amount').should('contain', expectedTotal)
})

Cypress.Commands.add('addProductToCartV2', (productUrl) => {
  cy.visit(productUrl)
  
  // Com v2, apenas clica no botão de adicionar (produtos simples ou já selecionados)
  cy.get('body').then(($body) => {
    if ($body.find('.single_add_to_cart_button').length > 0) {
      cy.get('.single_add_to_cart_button').click()
      cy.wait(2000)
    }
  })
})
