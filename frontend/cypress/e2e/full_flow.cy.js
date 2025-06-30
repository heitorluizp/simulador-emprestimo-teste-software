describe('Full Application End-to-End Flow', () => {
  beforeEach(() => {
    cy.writeFile('../backend/db.json', { simulations: [] });
  });

  it('should allow a user to submit a simulation and an admin to see it in the dashboard', () => {
    cy.visit('http://localhost:5173');

    const uniqueLoanAmount = '9876.54';
    const formattedLoanAmount = '9.876,54';

    cy.get('#valor_emprestimo').type(uniqueLoanAmount);
    cy.get('#prazo_meses').type('24');
    cy.get('#data_nascimento').type('01/01/1990');

    cy.get('button').contains('Calcular').click();

    cy.contains('Cálculo realizado com sucesso!').should('be.visible');

    cy.visit('http://localhost:5173/#admin');

    cy.get('#username').type('admin');
    cy.get('#password').type('password123');
    cy.get('button').contains('Entrar').click();

    cy.contains('Dashboard Administrativo', { timeout: 10000 }).should(
      'be.visible',
    );

    cy.contains('Total de Simulações')
      .parent()
      .contains('1')
      .should('be.visible');

    cy.get('table').contains('td', formattedLoanAmount).should('be.visible');
  });
});
