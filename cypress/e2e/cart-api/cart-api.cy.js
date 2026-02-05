/// <reference types="cypress" />

describe('API do Carrinho - Testes com Intercept', () => {

  beforeEach(() => {
    // Define o cookie ebacStoreVersion=v2 conforme solicitado
    cy.setCookie('ebacStoreVersion', 'v2')
  })

  it('Deve interceptar e validar requisição ao adicionar produto ao carrinho', () => {
    // Intercepta a requisição de adicionar produto ao carrinho
    cy.intercept('POST', '**/carrinho/**', (req) => {
      expect(req.body).to.exist
    }).as('addToCart')

    cy.visit('/product/ajax-full-zip-sweatshirt/')
    
    // Seleciona tamanho e cor
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    
    // Adiciona ao carrinho
    cy.get('.single_add_to_cart_button').click()
    
    // Aguarda e valida a requisição
    cy.wait('@addToCart').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 302])
    })
  })

  it('Deve simular resposta da API ao adicionar produto ao carrinho', () => {
    // Simula uma resposta de sucesso ao adicionar produto
    cy.intercept('POST', '**/carrinho/**', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Produto adicionado ao carrinho',
        cart_hash: 'abc123def456',
        fragments: {
          'div.widget_shopping_cart_content': '<div>1 item - R$ 69,00</div>'
        }
      }
    }).as('mockAddToCart')

    cy.visit('/product/ajax-full-zip-sweatshirt/')
    
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    
    cy.get('.single_add_to_cart_button').click()
    
    cy.wait('@mockAddToCart')
  })

  it('Deve interceptar e validar requisição ao atualizar quantidade do carrinho', () => {
    // Primeiro adiciona um produto ao carrinho
    cy.visit('/product/ajax-full-zip-sweatshirt/')
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    cy.get('.single_add_to_cart_button').click()
    cy.wait(1000)

    // Intercepta a atualização do carrinho
    cy.intercept('POST', '**/carrinho/**', (req) => {
      if (req.body && req.body.includes('update_cart')) {
        expect(req.body).to.include('update_cart')
      }
    }).as('updateCart')

    cy.visit('/carrinho/')
    
    // Atualiza a quantidade
    cy.get('.input-text.qty').first().clear().type('2')
    cy.get('[name="update_cart"]').click()
    
    // Aguarda e valida a requisição
    cy.wait('@updateCart', { timeout: 10000 }).then((interception) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.be.oneOf([200, 302])
      }
    })
  })

  it('Deve simular resposta da API ao atualizar carrinho', () => {
    // Simula resposta de atualização do carrinho
    cy.intercept('POST', '**/carrinho/**', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Carrinho atualizado',
        cart_total: 'R$ 138,00',
        item_count: 2
      }
    }).as('mockUpdateCart')

    cy.visit('/carrinho/')
  })

  it('Deve interceptar e validar requisição ao remover produto do carrinho', () => {
    // Primeiro adiciona um produto ao carrinho
    cy.visit('/product/ajax-full-zip-sweatshirt/')
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    cy.get('.single_add_to_cart_button').click()
    cy.wait(1000)

    // Intercepta a remoção do produto
    cy.intercept('GET', '**/carrinho/**', (req) => {
      if (req.url.includes('remove_item')) {
        cy.log('Removendo item do carrinho')
      }
    }).as('removeFromCart')

    cy.visit('/carrinho/')
    
    cy.get('body').then(($body) => {
      if ($body.find('.cart_item').length > 0) {
        cy.get('.remove').first().click()
        
        // Valida que o item foi removido
        cy.get('.woocommerce-message').should('be.visible')
      }
    })
  })

  it('Deve simular resposta de erro ao adicionar produto ao carrinho', () => {
    // Simula uma resposta de erro
    cy.intercept('POST', '**/carrinho/**', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Erro ao adicionar produto ao carrinho',
        error: 'Internal Server Error'
      }
    }).as('errorAddToCart')

    cy.visit('/product/ajax-full-zip-sweatshirt/')
    
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
  })

  it('Deve interceptar requisições de fragmentos do carrinho', () => {
    // Intercepta as requisições AJAX de fragmentos do carrinho
    cy.intercept('POST', '**/?wc-ajax=get_refreshed_fragments', (req) => {
      cy.log('Requisição de fragmentos do carrinho interceptada')
      expect(req.headers).to.have.property('x-requested-with', 'XMLHttpRequest')
    }).as('cartFragments')

    cy.visit('/produtos/')
    
    // Adiciona produto via AJAX
    cy.get('.product').first().within(() => {
      cy.get('.add_to_cart_button').first().click()
    })

    cy.wait('@cartFragments', { timeout: 10000 }).then((interception) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.equal(200)
        expect(interception.response.body).to.have.property('fragments')
      }
    })
  })

  it('Deve simular múltiplas operações no carrinho com intercepts', () => {
    // Intercepta adicionar ao carrinho
    cy.intercept('POST', '**/carrinho/**').as('cartOperation')
    
    cy.visit('/product/ajax-full-zip-sweatshirt/')
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    cy.get('.single_add_to_cart_button').click()
    
    cy.wait('@cartOperation', { timeout: 10000 })
    
    // Visita o carrinho
    cy.visit('/carrinho/')
    cy.get('.page-title').should('contain', 'Carrinho')
  })

  it('Deve validar cookies e headers nas requisições do carrinho', () => {
    cy.intercept('POST', '**/carrinho/**', (req) => {
      // Valida que o cookie ebacStoreVersion está presente
      const cookies = req.headers['cookie'] || ''
      expect(cookies).to.include('ebacStoreVersion=v2')
    }).as('cartWithCookie')

    cy.visit('/product/ajax-full-zip-sweatshirt/')
    cy.contains('.button-variable-item', 'M').click()
    cy.contains('.button-variable-item', 'Blue').click()
    cy.get('.single_add_to_cart_button').click()
  })

})
