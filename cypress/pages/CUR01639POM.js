let url = 'https://b2crunt2dev.b2clogin.com/b2crunt2dev.onmicrosoft.com/b2c_1a_singupsingin/oauth2/v2.0/authorize?client_id=9d307fda-429a-4726-9ea3-c7c0a275c740&scope=https%3A%2F%2Fb2cRunt2dev.onmicrosoft.com%2FRNFTransversalMS%2Faccess.all%20openid%20profile%20offline_access';
let buttonContinue = '#continue';
let textboxPassword = '#password';
let textboxUser = '#signInName';
let buttonNext = '#next';
let buttonContinueAlert = '.swal2-cancel';
let buttonCerrarTutorial = '#exitTour';
let buttonMenu = '.ng-star-inserted > .mat-tooltip-trigger > .mat-icon';
let dataNIT;
let cantidad_registros;
let buttonRadicar = ' Radicar/Entregar ';
let buttonRegistraSolu = ' Registrar solicitud ';
let buttonSICOV = ' Sicov ';
let buttonAgregarContrato = ' Agregar contrato ';
let TipoDOC = '#tipoDocumento';
let TipoDOCValor = 'NIT';
let NumeroDOC = '#numeroDocumento';
let SelectTipoRegistro = '#tipoRegistro';
let ValorSelectTipoRegistro = 'Identificación de la persona jurídica';
let inputNumcontrato = '#numeroContrato';
let NumeroContrato = Math.floor(Math.random() * 1001)
let filePath = "/PruebaQA";
let buttonFechaInicio = '#fechaInicio';
let buttonDiaFechaInicio = '.mat-calendar-body-cell-content.mat-focus-indicator.mat-calendar-body-today';
let ButtonFechaFin = '#fechaFin';
let ButtonDiaFechaFin = "button[aria-label='28 de febrero de 2024'] div[class='mat-calendar-body-cell-content mat-focus-indicator']";
let buttonAdjuntar = '#archivo';
let ButtonGuardar = ' Guardar ';

class ClasesContratoSICOV {

    static validar_Login_2() {
        cy.log('adas')
    }
}

export default ClasesContratoSICOV