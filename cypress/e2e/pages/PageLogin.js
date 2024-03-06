import {ValidacionesFront} from "../../helpers/validaciones_front";

export class PageLogin {

    static configuracionesIniciales() {
        cy.clearCookies();
        cy.clearAllCookies();
        cy.clearAllSessionStorage();
        cy.clearAllLocalStorage();
        cy.viewport(1325, 1068);
    }

    static ingresarUsuario(perfil) {
        cy.get('#signInName', {timeout: 180000}).invoke('val', Cypress.env(`USER_RUNTPRO_${perfil}`));
    }

    static ingresarCredencial(perfil) {
        cy.get('#password', {timeout: 180000}).invoke('val', Cypress.env(`PASSWORD_RUNTPRO_${perfil}`));
    }

    static visitarAplicativo() {
        cy.visit('https://b2crunt2dev.b2clogin.com/b2crunt2dev.onmicrosoft.com/b2c_1a_singupsingin/oauth2/v2.0/authorize?client_id=9d307fda-429a-4726-9ea3-c7c0a275c740&scope=https%3A%2F%2Fb2cRunt2dev.onmicrosoft.com%2FRNFTransversalMS%2Faccess.all%20openid%20profile%20offline_access', {timeout: 180000});
    }

    static clickBotonContinuarPoliticasSeguridad() {
        cy.get('#continue', {timeout: 180000}).click();
    }

    static interceptoValidarSesiones() {
        cy.intercept('POST', '/RNFShellMS/validarSession', {
            statusCode: 200, // Specify the desired status code
            body:
                {
                    "contenido": "Error",
                    "error": true,
                    "codigoResultado": "OK",
                    "descripcionRespuesta": "El usuario ya ha alcanzado el número máximo permitido de sesiones. Cierre una de las sesiones existentes antes de intentar iniciar sesión nuevamente."
                } // Optional response body
        }).as('interceptoRequestValidarSession')
    }

    static interceptoValidarEstado() {
        cy.intercept('POST', '/RNFShellMS/ValidarOrganismo/validarEstado', {
            statusCode: 200, // Specify the desired status code
            body:
                {
                    "contenido": "OK",
                    "error": false,
                    "codigoResultado": "OK",
                    "descripcionRespuesta": ""
                }  // Optional response body
        }).as('validarEstado')
    }

    static clickBotonIniciarSesion() {
        cy.get('#next', {timeout: 180000}).click();
    }

    static clickBotonCerrarAlertValidarSesiones() {
        cy.get('.swal2-cancel',  {timeout: 110000}).click({force: true});
    }

    static cerrarTutorialInicio() {
        cy.get('#exitTour', {timeout: 180000}).click({force: true});
    }

    static validarLogin(perfil) {
        // Limpieza de cookies y sesiones anteriores
        PageLogin.configuracionesIniciales();
        // Visitando página Runt 2.0
        PageLogin.visitarAplicativo();
        // Click en el botón continuar de la vista politicas de seguridad
        PageLogin.clickBotonContinuarPoliticasSeguridad();
        // Ingresando usuario
        PageLogin.ingresarUsuario(perfil);
        // Ingresando contraseña
        PageLogin.ingresarCredencial(perfil);
        // Interceptando el servicio validar sesiones
        PageLogin.interceptoValidarSesiones();
        // Interceptando el servicio validar estado
        PageLogin.interceptoValidarEstado();
        // Click en el botón iniciar sesión
        PageLogin.clickBotonIniciarSesion();
        // Espera de 5 segundos en el aplicativo
        ValidacionesFront.esperaExplicita(5000);
        // Cerrando el alert de sesiones abiertas
        PageLogin.clickBotonCerrarAlertValidarSesiones();
        // Recargando la página
        ValidacionesFront.recargarPagina()
        // Cerrando el alert de sesiones abiertas
        PageLogin.clickBotonCerrarAlertValidarSesiones();
        // Cerrando el tutorial de inicio
        PageLogin.cerrarTutorialInicio();
        // Validando la url actual
        ValidacionesFront.validarUrlActual('https://azspkdevstcus004.z19.web.core.windows.net/#/home')
    }

}