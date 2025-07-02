describe("Regular user flow", () => {
  it("user should be capable of simulate multiple loans", () => {
    cy.visit("/");

    cy.get("#valor_emprestimo").clear().type("20000");
    cy.get("#prazo_meses").clear().type("0");
    cy.get("#data_nascimento").clear().type("01/01/1991");
    cy.get('button').contains(/^calcular$/i).click();

    cy.get("#prazo_meses").clear().type("72");
    cy.get('button').contains(/^calcular$/i).click();
    cy.get(".MuiChip-label").contains("Valor do Empréstimo: R$ 20.000,00").should("be.visible");

    cy.get('button').contains(/ver tabela de amortização/i).click();
    cy.get('.MuiDialog-root').should('exist').and('be.visible');
    cy.get('table', { timeout: 8000 }).should('exist');
    cy.get('button').contains(/^fechar$/i).click();

    cy.get("#valor_emprestimo").clear().type("30000");
    cy.get("#prazo_meses").clear().type("60");
    cy.get("#data_nascimento").clear().type("01/01/1991");
    cy.get('button').contains(/^calcular$/i).click();
    cy.get(".MuiChip-label").contains("Valor do Empréstimo: R$ 30.000,00").should("be.visible");

    cy.get("#valor_emprestimo").clear().type("40000");
    cy.get("#prazo_meses").clear().type("48");
    cy.get("#data_nascimento").clear().type("01/01/1991");
    cy.get('button').contains(/^calcular$/i).click();
    cy.get(".MuiChip-label").contains("Valor do Empréstimo: R$ 40.000,00").should("be.visible");

    cy.get("#valor_emprestimo").clear().type("45000");
    cy.get("#prazo_meses").clear().type("60");
    cy.get("#data_nascimento").clear().type("01/01/1991");
    cy.get('button').contains(/^calcular$/i).click();
    cy.get(".MuiChip-label").contains("Valor do Empréstimo: R$ 45.000,00").should("be.visible");
  });
});