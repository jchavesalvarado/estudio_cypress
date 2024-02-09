describe('Selector ID', () => {

    it('Iniciar Sesión', () => {
        cy.visit('https://admin-demo.nopcommerce.com/login');
        // Ingresamos en usuario - Etiqueta Id
        cy.get('input#Email').clear().type('admin@yourstore.com');
        // Ingresamos la contraseña - Id
        cy.get('#Password').clear().type('admin');
        // Hacemos click en el botón iniciar sesión - Clase
        cy.get('.button-1.login-button').click();
    })

});