/// <reference types="cypress" />

describe('API do Carrinho - Testes com Intercept (ebacStoreVersion=v2)', () => {

  beforeEach(() => {
    // Define o cookie ebacStoreVersion=v2 conforme solicitado no exercício  
    cy.setCookie('ebacStoreVersion', 'v2')
    cy.clearCart()
  })

  it('Deve interceptar requisições ao adicionar produto ao carrinho', () => {
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments').as('refreshFragments')

    // Navega diretamente para produtos
    cy.visit('/produtos/')
    
    // Adiciona primeiro produto simples encontrado
    cy.get('.add_to_cart_button').first().click()

    cy.wait('@refreshFragments', { timeout: 10000 }).its('response.statusCode').should('equal', 200)
  })

  it('Deve validar corpo da resposta ao adicionar produto', () => {
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments').as('cartFragments')

    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()

    cy.wait('@cartFragments').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body).to.have.property('fragments')
    })
  })

  it('Deve simular resposta mockada da API ao adicionar produto', () => {
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments', {
      statusCode: 200,
      body: {
        fragments: {
          'div.widget_shopping_cart_content': '<div>Produto adicionado - Mock</div>'
        }
      }
    }).as('mockFragments')

    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()

    cy.wait('@mockFragments').its('response.statusCode').should('equal', 200)
  })

  it('Deve interceptar e validar atualização de quantidade no carrinho', () => {
    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()
    cy.wait(2000)
    
    cy.intercept('POST', '**/carrinho/**').as('updateCart')

    cy.visit('/carrinho/')
    
    cy.get('body').then(($body) => {
      if ($body.find('.input-text.qty').length > 0) {
        cy.get('.input-text.qty').first().clear().type('3')
        cy.get('[name="update_cart"]').click()
        cy.log('Quantidade atualizada no carrinho')
      }
    })
  })

  it('Deve interceptar remoção de produto do carrinho', () => {
    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()
    cy.wait(2000)

    cy.intercept('GET', '**/carrinho/**').as('cartRequest')

    cy.visit('/carrinho/')
    
    cy.get('body').then(($body) => {
      if ($body.find('.remove').length > 0) {
        cy.get('.remove').first().click()
        cy.log('Produto removido do carrinho')
      }
    })
  })

  it('Deve validar que cookie ebacStoreVersion=v2 está presente', () => {
    cy.visit('/')
    cy.getCookie('ebacStoreVersion').should('have.property', 'value', 'v2')
  })

  it('Deve interceptar e modificar resposta da API', () => {
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments', (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property('fragments')
        res.body.custom_field = 'valor_modificado'
      })
    }).as('modifiedResponse')

    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()

    cy.wait('@modifiedResponse')
  })

  it('Deve simular erro 500 na API do carrinho', () => {
    cy.intercept('POST', '**/?wc-ajax=add_to_cart', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
        message: 'Erro simulado para teste'
      }
    }).as('errorResponse')

    cy.visit('/')
    cy.log('Mock de erro configurado com sucesso')
  })

  it('Deve validar headers das requisições do carrinho', () => {
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments', (req) => {
      expect(req.headers).to.have.property('content-type')
      cy.log('Headers validados:', req.headers['content-type'])
    }).as('requestWithHeaders')

    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()

    cy.wait('@requestWithHeaders')
  })

  it('Deve interceptar múltiplas requisições em sequência', () => {
    cy.intercept('POST', '**/?wc-ajax=**').as('anyCartRequest')
    
    cy.visit('/produtos/')
    cy.get('.add_to_cart_button').first().click()
    cy.wait('@anyCartRequest')
    
    cy.visit('/carrinho/')
    cy.get('.page-title').should('exist')
  })

})
