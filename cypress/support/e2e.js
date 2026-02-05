import './commands'

// Ignora erros de uncaught exceptions da aplicação
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para prevenir que o Cypress falhe o teste
  return false
})
