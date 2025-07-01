describe("Login and logout", () => {
  it("admin should login and logout", () => {
    cy.visit("/#admin");

    cy.get("#username").type("admin");
    cy.get("#password").type("password123");
    cy.get("button").contains("Entrar").click();

    cy.contains("Dashboard Administrativo", { timeout: 10000 }).should(
      "be.visible"
    );

    cy.get("button").contains("Logout").click();

    cy.contains("Admin Login", { timeout: 10000 }).should("be.visible");
  });
});
