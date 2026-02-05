/// <reference types="cypress" />

describe('Checkout - Carrinho de Compras com Dados Dinâmicos', () => {

  beforeEach(() => {
    // Limpa o carrinho antes de cada teste
    cy.clearCart()
  })

  it('Deve adicionar produto ao carrinho com dados dinâmicos', () => {
    cy.fixture('test-data.json').then((data) => {
      cy.generateProductQuantity(1, 3).then((quantity) => {
        cy.addProductToCart(data.products.sweatshirt, 'M', 'Blue', quantity)
        cy.visit('/carrinho/')
        cy.get('.cart_item').should('have.length.greaterThan', 0)
        
        // Valida a quantidade
        cy.get('.input-text.qty').first().should('have.value', quantity.toString())
      })
    })
  })

  it('Deve completar checkout com dados de cobrança dinâmicos', () => {
    cy.fixture('test-data.json').then((data) => {
      // Faz login
      cy.login(data.validUser.username, data.validUser.password)
      
      // Adiciona produto ao carrinho
      cy.addProductToCart(data.products.tank, 'XS', 'Blue')
      
      // Gera dados dinâmicos de cobrança
      cy.generateBillingData().then((billingData) => {
        cy.completeCheckout(billingData)
        
        // Valida sucesso
        cy.url().should('include', '/checkout/order-received/')
        cy.get('.woocommerce-notice--success').should('be.visible')
      })
    })
  })

  it('Deve adicionar múltiplos produtos com quantidades dinâmicas', () => {
    cy.fixture('test-data.json').then((data) => {
      // Produto 1
      cy.generateProductQuantity(1, 2).then((qty1) => {
        cy.addProductToCart(data.products.sweatshirt, 'M', 'Blue', qty1)
      })
      
      // Produto 2
      cy.generateProductQuantity(1, 2).then((qty2) => {
        cy.addProductToCart(data.products.ariel, 'S', 'Green', qty2)
      })
      
      // Verifica carrinho
      cy.visit('/carrinho/')
      cy.get('.cart_item').should('have.length', 2)
    })
  })

  it('Deve atualizar quantidade no carrinho dinamicamente', () => {
    cy.fixture('test-data.json').then((data) => {
      // Adiciona produto
      cy.addProductToCart(data.products.sweatshirt, 'M', 'Blue')
      
      cy.visit('/carrinho/')
      
      // Atualiza para quantidade dinâmica
      cy.generateProductQuantity(2, 5).then((newQuantity) => {
        cy.get('.input-text.qty').first().clear().type(newQuantity.toString())
        cy.get('[name="update_cart"]').click()
        
        cy.wait(1000)
        cy.get('.input-text.qty').first().should('have.value', newQuantity.toString())
      })
    })
  })

  it('Deve processar pedido completo com dados dinâmicos', () => {
    cy.fixture('test-data.json').then((data) => {
      // Login
      cy.login(data.validUser.username, data.validUser.password)
      
      // Adiciona produtos com quantidades dinâmicas
      cy.generateProductQuantity(1, 3).then((quantity) => {
        cy.addProductToCart(data.products.sweatshirt, 'L', 'Red', quantity)
        
        // Gera dados de cobrança
        cy.generateBillingData().then((billingData) => {
          cy.completeCheckout(billingData)
          
          // Validações
          cy.url().should('include', '/checkout/order-received/')
          cy.get('.woocommerce-order-overview__order').should('be.visible')
        })
      })
    })
  })

  it('Deve verificar produto no carrinho após adicionar com dados dinâmicos', () => {
    cy.fixture('test-data.json').then((data) => {
      cy.addProductToCart(data.products.tank, 'XS', 'Blue')
      cy.visit('/carrinho/')
      cy.get('.page-title').should('be.visible')
    })
  })

})
