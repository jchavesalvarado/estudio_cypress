describe('Selectores con descendencia', () => {

    it('Consultar Producto', () => {
        cy.visit('http://demo-store.seleniumacademy.com/');
        // cy.get('#header-search .input-box').type('PANTS');
        // cy.get('#header-search .input-box input').type('PANTS');
        cy.get('#header-search .input-box .input-text.required-entry').type('PANTS');
        //cy.get('#header-search .input-box button').click();
        cy.get('#header-search .input-box button[title="Search"]').click();
        cy.get('.actions a[href="http://demo-store.seleniumacademy.com/bowery-chino-pants-541.html"]').click();
    });

    it('Comprar Producto', () => {
        cy.get('.add-to-cart .qty-wrapper input').clear().type(2);
        cy.get('#configurable_swatch_color #option25').click()
        cy.get('#configurable_swatch_size #option64').click()
        cy.get('.add-to-cart-buttons button[title="Add to Cart"]').click({force: true})
        cy.get('.checkout-types.top li button[title="Proceed to Checkout"]').click()
    })

});