export class ValidacionesFront {

    static esperaExplicita(tiempoMilisegundos) {
        cy.wait(tiempoMilisegundos);
    }

    static recargarPagina() {
        cy.reload();
    }

    static validarUrlActual(url) {
        cy.url().should('eq', url)
    }

}