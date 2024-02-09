describe('Mi primer test', () => {

    it('Test 1 - Verificar título de la página - Exitoso', () => {
        // Visitando una url
        cy.visit('https://opensource-demo.orangehrmlive.com');
        // Validando el título de un página con un assertion
        cy.title().should('eq', 'OrangeHRM');
    });

    it('Test 2 - Verificar título de la página - Fallido', () => {
        // Visitando una url
        cy.visit('https://opensource-demo.orangehrmlive.com');
        // Validando el título de un página con un assertion
        cy.title().should('eq', 'orangehrm');
    });

});