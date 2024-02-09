describe('Selectores combinadores', () => {

    it('Validr Barra de navegación', () => {
        // Validando las opciones del nav
        cy.visit('http://demo-store.seleniumacademy.com/');
        // Selector de hijo directo
        cy.get('#nav .nav-primary > li').should('have.length', 6);
        // Selector de hermano directo
        cy.get('.logo + div').should('have.length', 1)
        // Selector de hermano general
        cy.get('.logo ~ div').should('have.length', 5)
    });

    it('Validar Footer', () => {
        // Selector de hijo directo
        cy.get('.footer-container .footer > div').should('have.length', 5)
        // Selector de hermano directo
        cy.get('.footer-container .footer .block.block-subscribe + div').should('have.length', 1)
        // Selector de hermano general
        cy.get('.footer-container .footer .block.block-subscribe ~ div').should('have.length', 4)
    })

});