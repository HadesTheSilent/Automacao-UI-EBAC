# EBAC - Automação de UI - Guia de Testes

## 📝 Documentação dos Testes

### Suíte 1: Criação de Conta (Page Objects)

**Localização:** `cypress/e2e/account-creation/account-creation.cy.js`

**Padrão:** Page Objects - Os elementos e ações estão encapsulados na classe `AccountPage`

#### Cenários Implementados:

1. **Criar conta com dados válidos** ✅
   - Gera email único usando timestamp
   - Preenche senha válida
   - Verifica dashboard após login

2. **Validar campos obrigatórios** ✅
   - Tenta criar conta sem preencher dados
   - Verifica exibição de mensagem de erro

3. **Validar formato de email inválido** ✅
   - Insere email sem formato válido
   - Verifica mensagem de erro específica

4. **Validar senha vazia** ✅
   - Preenche apenas email
   - Verifica erro de senha obrigatória

5. **Validar email vazio** ✅
   - Preenche apenas senha
   - Verifica erro de email obrigatório

6. **Email já existente** ✅
   - Tenta cadastrar email duplicado
   - Verifica mensagem de erro apropriada

---

### Suíte 2: Checkout - Carrinho de Compras (AppActions)

**Localização:** `cypress/e2e/checkout/checkout.cy.js`

**Padrão:** AppActions - Comandos customizados do Cypress que encapsulam fluxos completos

#### Cenários Implementados:

1. **Adicionar produto e finalizar compra** ✅
   - Adiciona produto com tamanho e cor
   - Completa checkout com dados válidos
   - Verifica confirmação do pedido

2. **Adicionar múltiplos produtos** ✅
   - Adiciona 3 produtos diferentes
   - Verifica todos no carrinho

3. **Validar cálculo do total** ✅
   - Adiciona produtos com quantidade
   - Verifica cálculo correto

4. **Atualizar quantidade no carrinho** ✅
   - Modifica quantidade de produto
   - Verifica atualização

5. **Remover produto do carrinho** ✅
   - Remove item
   - Verifica carrinho vazio

6. **Fluxo direto para checkout** ✅
   - Usa comando combinado
   - Vai direto do produto para checkout

7. **Validar campos obrigatórios** ✅
   - Tenta finalizar sem dados
   - Verifica mensagens de erro

---

## 🎯 Comandos AppActions Disponíveis

### `cy.login(username, password)`
Realiza login na aplicação

### `cy.addProductToCart(productUrl, size, color, quantity)`
Adiciona produto ao carrinho com opções

### `cy.clearCart()`
Limpa completamente o carrinho

### `cy.completeCheckout(billingData)`
Preenche dados e finaliza checkout

### `cy.addToCartAndGoToCart(productUrl, size, color)`
Fluxo combinado: adiciona e vai para carrinho

### `cy.verifyProductInCart(productName)`
Verifica presença de produto no carrinho

### `cy.verifyCartTotal(expectedTotal)`
Valida total do carrinho

---

## 📂 Estrutura de Page Objects

### AccountPage
- **Elementos:** Campos de registro, botões, mensagens
- **Ações:** visit(), registerNewAccount(), fill*()
- **Verificações:** verifySuccessfulRegistration(), verifyErrorMessage()

### ProductPage
- **Elementos:** Botões de adicionar, seletores de variação
- **Ações:** selectSize(), selectColor(), addToCart()

### CartPage
- **Elementos:** Tabela do carrinho, totais, botões
- **Ações:** updateQuantity(), proceedToCheckout()
- **Verificações:** verifyProductInCart(), verifyCartTotal()

### CheckoutPage
- **Elementos:** Formulário de faturamento
- **Ações:** fillBillingDetails(), placeOrder()
- **Verificações:** verifyOrderSuccess()

---

## 🚀 Como Executar

### Instalar dependências
```bash
npm install
```

### Executar todos os testes
```bash
npm run test:all
```

### Executar testes de criação de conta
```bash
npm run test:account
```

### Executar testes de checkout
```bash
npm run test:checkout
```

### Abrir Cypress Test Runner (modo interativo)
```bash
npm run cy:open
```

---

## 📊 Comparação: Page Objects vs AppActions

### Page Objects
✅ **Vantagens:**
- Separação clara de responsabilidades
- Fácil manutenção quando a UI muda
- Reutilização de código
- Testes mais legíveis

❌ **Desvantagens:**
- Mais código para escrever inicialmente
- Estrutura de classes adicional

### AppActions
✅ **Vantagens:**
- Comandos de alto nível
- Menos código nos testes
- Fluxos completos encapsulados
- Integração nativa com Cypress

❌ **Desvantagens:**
- Pode ficar complexo com muitas variações
- Menos granularidade

---

## 🔍 Observações Importantes

1. **Email único:** Os testes de criação de conta geram emails únicos usando timestamp para evitar conflitos

2. **Limpeza do carrinho:** Cada teste de checkout limpa o carrinho no `beforeEach` para garantir estado limpo

3. **Dados de teste:** Armazenados em `cypress/fixtures/test-data.json` para facilitar manutenção

4. **Seletores:** Priorizados seletores semânticos e estáveis para maior confiabilidade

---

## 📝 Melhorias Futuras

- [ ] Adicionar testes de login
- [ ] Implementar testes de busca de produtos
- [ ] Adicionar testes de filtros e categorias
- [ ] Implementar relatórios de teste com Mochawesome
- [ ] Adicionar CI/CD com GitHub Actions
