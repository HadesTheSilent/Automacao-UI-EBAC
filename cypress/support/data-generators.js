const faker = require('faker')

faker.locale = 'pt_BR'

Cypress.Commands.add('generateUserData', () => {
  const timestamp = new Date().getTime()
  
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `user${timestamp}@teste.com`,
    password: `Senha@${faker.random.number({ min: 1000, max: 9999 })}`,
    phone: faker.phone.phoneNumber('(##) #####-####'),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    postcode: faker.address.zipCode('#####-###')
  }
})

Cypress.Commands.add('generateBillingData', () => {
  cy.fixture('test-data.json').then((data) => {
    const timestamp = new Date().getTime()
    const randomState = data.states[Math.floor(Math.random() * data.states.length)]
    
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: randomState,
      postcode: faker.address.zipCode('#####-###'),
      phone: faker.phone.phoneNumber('(##) #####-####'),
      email: `billing${timestamp}@teste.com`
    }
  })
})

Cypress.Commands.add('generateProductQuantity', (min = 1, max = 5) => {
  return faker.random.number({ min, max })
})
