/// <reference types="cypress" />

describe('API do Carrinho - Testes com Intercept (ebacStoreVersion=v2)', () => {

  beforeEach(() => {
    // Define o cookie ebacStoreVersion=v2 conforme solicitado no exercício  
    cy.setCookie('ebacStoreVersion', 'v2')
    cy.visit('/')
  })

  it('Deve interceptar requisição ao buscar produtos', () => {
    cy.intercept('GET', '**/public/getProducts*').as('getProducts')

    cy.get('[href="/Tab/Browse"]').click()

    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
  })

  it('Deve validar corpo da resposta ao buscar produtos', () => {
    cy.intercept('GET', '**/public/getProducts*').as('getProducts')

    cy.get('[href="/Tab/Browse"]').click()

    cy.wait('@getProducts').then((interception) => {
      if (interception.response.statusCode === 200) {
        expect(interception.response.body).to.be.an('array')
        expect(interception.response.body[0]).to.have.property('_id')
        expect(interception.response.body[0]).to.have.property('name')
      } else {
        // 304 indica que o cache está sendo usado - isso é válido
        expect(interception.response.statusCode).to.equal(304)
      }
    })
  })

  it('Deve validar cache da resposta ao buscar produtos', () => {
    cy.intercept('GET', '**/public/getProducts*').as('getProducts')

    cy.get('[href="/Tab/Browse"]').click()

    cy.wait('@getProducts').then((interception) => {
      // Valida que a requisição foi bem sucedida ou retornou cache 304
      expect(interception.response.statusCode).to.be.oneOf([200, 304])
    })
  })

  it('Deve interceptar requisição ao buscar banners', () => {
    cy.intercept('GET', '**/public/getBanners').as('getBanners')

    cy.wait('@getBanners', { timeout: 10000 }).its('response.statusCode').should('be.oneOf', [200, 304])
  })

  it('Deve interceptar requisição ao buscar categorias', () => {
    cy.intercept('GET', '**/public/getCategories').as('getCategories')

    cy.wait('@getCategories', { timeout: 10000 }).its('response.statusCode').should('be.oneOf', [200, 304])
  })

  it('Deve interceptar requisição getCart', () => {
    cy.intercept('GET', '**/public/getCart*').as('getCart')

    cy.wait('@getCart', { timeout: 10000 }).its('response.statusCode').should('be.oneOf', [200, 400])
  })

  it('Deve validar parâmetros da requisição getCart', () => {
    cy.intercept('GET', '**/public/getCart*').as('getCart')

    cy.wait('@getCart', { timeout: 10000 }).then((interception) => {
      expect(interception.request.url).to.include('userId')
    })
  })

  it('Deve simular resposta mockada para getCart vazio', () => {
    cy.intercept('GET', '**/public/getCart*', {
      statusCode: 200,
      body: {
        products: [],
        total: 0
      }
    }).as('emptyCart')

    cy.reload()

    cy.wait('@emptyCart', { timeout: 10000 }).its('response.body.products').should('have.length', 0)
  })

  it('Deve validar headers da requisição getProducts', () => {
    cy.intercept('GET', '**/public/getProducts*').as('getProducts')

    cy.get('[href="/Tab/Browse"]').click()

    cy.wait('@getProducts').then((interception) => {
      expect(interception.request.headers).to.exist
      // Valida content-type no response (pode ser Content-Type ou content-type)
      const headers = interception.response.headers
      const hasContentType = headers['content-type'] || headers['Content-Type']
      expect(hasContentType).to.exist
    })
  })

  it('Deve simular erro 500 ao buscar produtos', () => {
    cy.intercept('GET', '**/public/getProducts*', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error'
      }
    }).as('getProductsError')

    cy.get('[href="/Tab/Browse"]').click()

    cy.wait('@getProductsError').its('response.statusCode').should('equal', 500)
  })

})
