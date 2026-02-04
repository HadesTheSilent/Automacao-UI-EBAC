/// <reference types="cypress" />

describe('Checkout - Carrinho de Compras - AppActions', () => {

  it('Deve adicionar produto ao carrinho usando AppActions', () => {
    cy.addProductToCart('/product/ajax-full-zip-sweatshirt/', 'M', 'Blue')
    cy.visit('/carrinho/')
    cy.get('.cart_item').should('have.length.greaterThan', 0)
  })

  it('Deve verificar produto no carrinho após adicionar', () => {
    cy.visit('/carrinho/')
    cy.get('.page-title').should('be.visible')
  })

  it('Deve acessar página de conta', () => {
    cy.visit('/minha-conta/')
    cy.url().should('include', '/minha-conta/')
  })

})
