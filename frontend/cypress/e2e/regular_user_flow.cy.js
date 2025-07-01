describe("Regular user flow", () => {
  it("user should be capable of simulate multiple loans", () => {
    cy.visit("/");
    cy.get("#valor_emprestimo").clear("2");
    cy.get("#valor_emprestimo").type("20000");
    cy.get("#prazo_meses").clear("0");
    cy.get("#prazo_meses").type("0");
    cy.get("#data_nascimento").clear("0");
    cy.get("#data_nascimento").type("01/01/1991");
    cy.get(".MuiButton-contained").click();
    cy.should("be.visible");
    cy.get("#prazo_meses").clear("7");
    cy.get("#prazo_meses").type("72");
    cy.get(".MuiButton-contained").click();
    cy.get(":nth-child(1) > .MuiChip-label").should(
      "have.text",
      "Valor do Empréstimo: R$ 20.000,00"
    );
    cy.get(".css-65op61 > .MuiBox-root > .MuiButtonBase-root").click();
    cy.get("#«r7»").should("be.visible");
    cy.get(".MuiDialogActions-root > .MuiButtonBase-root").click();
    cy.get(".MuiButton-outlinedInfo").click();
    cy.get("#valor_emprestimo").clear("3");
    cy.get("#valor_emprestimo").type("30000");
    cy.get("#prazo_meses").clear("6");
    cy.get("#prazo_meses").type("60");
    cy.get("#data_nascimento").clear("1");
    cy.get("#data_nascimento").type("01/01/1991");
    cy.get(".MuiButton-contained").click();
    cy.get(":nth-child(1) > .MuiChip-label").should(
      "have.text",
      "Valor do Empréstimo: R$ 30.000,00"
    );
    cy.get(".MuiButton-outlinedInfo").click();
    cy.get("#valor_emprestimo").clear("4");
    cy.get("#valor_emprestimo").type("40000");
    cy.get(".css-0 > .MuiBox-root > :nth-child(2)").click();
    cy.get("#prazo_meses").clear();
    cy.get("#prazo_meses").type("48");
    cy.get("#data_nascimento").clear("0");
    cy.get("#data_nascimento").type("01/01/1991");
    cy.get(".css-65op61").click();
    cy.get(".MuiButton-outlined").click();
    cy.get("#valor_emprestimo").clear("4");
    cy.get("#valor_emprestimo").type("45000");
    cy.get("#prazo_meses").clear("6");
    cy.get("#prazo_meses").type("60");
    cy.get("#data_nascimento").clear("0");
    cy.get("#data_nascimento").type("01/01/1991");
    cy.get(".MuiButton-contained").click();
    cy.get(":nth-child(1) > .MuiChip-label").should(
      "have.text",
      "Valor do Empréstimo: R$ 45.000,00"
    );
  });
});
