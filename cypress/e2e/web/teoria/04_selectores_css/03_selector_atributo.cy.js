describe('Selector de Atributo', () => {

    it('Iniciar Sesión', () => {
        cy.visit('https://admin-demo.nopcommerce.com/login');
        cy.get('[name="Email"]').clear().type('admin@yourstore.com');
        cy.get('input[name="Password"]').clear().type('admin');
        //cy.get('button[class="button-1"]').click();
        cy.get('button[class="button-1 login-button"]').click();
    });

    it('Filtrando Productos', () => {
        cy.contains('Catalog').click();
        cy.contains('Products').click({force: true});
        cy.get('[name^="Search"]').should('have.length', 10);
        cy.get('[name$="ProductName"]').clear().type('MacBook');
        cy.get('select[name*="Category"]').select('Computers >> Notebooks');
        cy.get('[name^="SearchWarehouse"]').select('Warehouse 2 (Los Angeles)');
        cy.get('[id="SearchProductTypeId"]').select('Grouped (product with variants)');
        cy.get('select#SearchPublishedId').select('Published only');
        cy.get('[name$="facturerId"]').select('Apple');
        cy.get('[name*="Vendor"]').select('Vendor 1');
        cy.get('button[class="btn btn-primary btn-search"]').click()
    });

});