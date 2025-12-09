/// <reference types="cypress" />

describe('Validação do Sistema de Teste Runner-Cogu', () => {
  
  // Cenário 1: Testa a navegação a partir da home
  it('Deve carregar a interface principal e navegar', () => {
    cy.visit('https://example.cypress.io')
    
    // Aguarda elemento estar visível antes de interagir (boa prática)
    cy.contains('type').should('be.visible').click()
    
    // Verifica se a URL mudou corretamente
    cy.url().should('include', '/commands/actions')
  })

  // Cenário 2: Testa o formulário de e-mail
  it('Deve verificar integridade dos dados no input de e-mail', () => {
    // CORREÇÃO: Visitamos diretamente a página onde o elemento '.action-email' existe.
    // Sem isso, o teste falharia pois o Cypress reseta a página entre os blocos 'it'.
    cy.visit('https://example.cypress.io/commands/actions')

  // Caso queira que o teste falhe propositalmente, descomente a linha abaixo:
    .should('have.value', 'cogu1')
    cy.get('.action-email')
      .should('be.visible') // Garante que o input existe e é visível
      .type('cogu')
      .should('have.value', 'cogu')
  })
})
