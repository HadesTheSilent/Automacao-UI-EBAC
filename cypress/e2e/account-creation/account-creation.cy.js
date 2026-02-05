import AccountPage from '../../pages/AccountPage'

const accountPage = new AccountPage()

describe('Criação de Conta - Page Objects com Dados Dinâmicos', () => {

  beforeEach(() => {
    accountPage.visit()
  })

  it('Deve criar uma nova conta com dados dinâmicos', () => {
    cy.generateUserData().then((userData) => {
      accountPage.registerNewAccount(userData.email, userData.password)
      accountPage.verifySuccessfulRegistration()
    })
  })

  it('Deve validar campos obrigatórios ao tentar criar conta', () => {
    accountPage.clickRegisterButton()
    accountPage.verifyRequiredFieldError()
  })

  it('Deve validar senha vazia com email dinâmico', () => {
    cy.generateUserData().then((userData) => {
      accountPage.fillRegistrationEmail(userData.email)
      accountPage.clickRegisterButton()
      accountPage.verifyRequiredFieldError()
    })
  })

  it('Deve validar email vazio com senha dinâmica', () => {
    cy.generateUserData().then((userData) => {
      accountPage.fillRegistrationPassword(userData.password)
      accountPage.clickRegisterButton()
      accountPage.verifyRequiredFieldError()
    })
  })

  it('Não deve permitir cadastro com email já existente', () => {
    const email = 'teste@teste.com'
    
    cy.generateUserData().then((userData) => {
      accountPage.registerNewAccount(email, userData.password)
      accountPage.verifyRequiredFieldError()
    })
  })

  it('Deve criar múltiplas contas com dados diferentes', () => {
    // Teste 1
    cy.generateUserData().then((userData1) => {
      accountPage.registerNewAccount(userData1.email, userData1.password)
      accountPage.verifySuccessfulRegistration()
      
      // Logout
      cy.get('.woocommerce-MyAccount-navigation-link--customer-logout > a').click()
      
      // Voltar para página de registro
      accountPage.visit()
      
      // Teste 2 com dados diferentes
      cy.generateUserData().then((userData2) => {
        accountPage.registerNewAccount(userData2.email, userData2.password)
        accountPage.verifySuccessfulRegistration()
      })
    })
  })

})
