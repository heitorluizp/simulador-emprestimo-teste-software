describe("Admin flow", () => {
  it("usuário navega entre simulação e área administrativa, faz login, logout e retorna", () => {
    cy.visit("/");
    cy.get('button').contains(/área administrativa/i).click();
    cy.contains(/admin login/i).should('be.visible');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('password123');
    cy.get('button').contains(/entrar/i).click();
    cy.contains(/dashboard/i).should('be.visible');
    cy.get('button').contains(/logout/i).click();
    cy.contains(/admin login/i).should('be.visible');
    cy.get('button').contains(/voltar para simulação/i).click();
    cy.contains(/simulador de cálculo/i).should('be.visible');
  });
});