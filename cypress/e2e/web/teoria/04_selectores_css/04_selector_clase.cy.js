describe('Selector de Clase', () => {

    it('Iniciar Sesión', () => {
        // Selectores de clase
        cy.visit('http://demo-store.seleniumacademy.com/customer/account/create/');
        cy.get('.input-text').should('have.length', 8);
        cy.get('.input-text.required-entry').should('have.length', 7);
        // Selectores de clase - atributo
        cy.get('.input-text.required-entry[name="firstname"]').clear().type('Johan');
        cy.get('.input-text[name="middlename"]').clear().type('Alejandro');
        cy.get('.input-text[title="Last Name"]').clear().type('Chaves');
        // cy.get('.input-text[type="email"]').should('have.length', 2);
        cy.get('#email_address').clear().type('johanes.chaves@runt.com.co')
        cy.get('.validate-password[type="password"]').clear().type('123456')
        // cy.get('input[type="password"]').clear().type('12345')
        cy.get('input[name="confirmation"]').clear().type('123456')
        cy.get('.button[title="Register"]').click()
        cy.contains('Account').click()
        cy.contains('Log Out').click()
    })

})