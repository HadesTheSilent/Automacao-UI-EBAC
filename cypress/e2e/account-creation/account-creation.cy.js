import AccountPage from '../../pages/AccountPage'

const accountPage = new AccountPage()

describe('Criação de Conta - Page Objects', () => {

  beforeEach(() => {
    accountPage.visit()
  })

  it('Deve criar uma nova conta com dados válidos', () => {
    const timestamp = new Date().getTime()
    const email = `usuario${timestamp}@teste.com`
    const password = 'Senha@123'

    accountPage.registerNewAccount(email, password)
    accountPage.verifySuccessfulRegistration()
  })

  it('Deve validar campos obrigatórios ao tentar criar conta', () => {
    accountPage.clickRegisterButton()
    accountPage.verifyRequiredFieldError()
  })

  it('Deve validar senha vazia', () => {
    const timestamp = new Date().getTime()
    const email = `usuario${timestamp}@teste.com`

    accountPage.fillRegistrationEmail(email)
    accountPage.clickRegisterButton()

    accountPage.verifyRequiredFieldError()
  })

  it('Deve validar email vazio', () => {
    const password = 'Senha@123'

    accountPage.fillRegistrationPassword(password)
    accountPage.clickRegisterButton()

    accountPage.verifyRequiredFieldError()
  })

  it('Não deve permitir cadastro com email já existente', () => {
    const email = 'teste@teste.com'
    const password = 'Senha@123'

    accountPage.registerNewAccount(email, password)

    accountPage.verifyRequiredFieldError()
  })

})
