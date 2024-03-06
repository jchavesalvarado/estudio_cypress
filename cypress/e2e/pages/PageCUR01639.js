let buttonMenu = '.ng-star-inserted > .mat-tooltip-trigger > .mat-icon';
let dataNIT;
let cantidad_registros;
let buttonRadicar = ' Radicar/Entregar ';
let buttonRegistraSolu = ' Registrar solicitud ';
let buttonSICOV = ' Sicov ';
let buttonAgregarContrato = ' Agregar contrato ';
let TipoDOC = '#tipoDocumento';
let NumeroDOC = '#numeroDocumento';
let SelectTipoRegistro = '#tipoRegistro';
let ValorSelectTipoRegistro = 'Identificación de la persona jurídica';
let inputNumcontrato = '#numeroContrato';
let NumeroContrato = Math.floor(Math.random() * 1001)
let filePath= "/PruebaQA";
let buttonFechaInicio = '#fechaInicio';
let buttonDiaFechaInicio = '.mat-calendar-body-cell-content.mat-focus-indicator.mat-calendar-body-today';
let ButtonFechaFin = '#fechaFin';
let ButtonDiaFechaFin = "button[aria-label='28 de febrero de 2024'] div[class='mat-calendar-body-cell-content mat-focus-indicator']";
let buttonAdjuntar = '#archivo';
let ButtonGuardar = ' Guardar ';
let RutaScript = Cypress.env('EXECUTABLE_PATH');
class ClasesContratoSICOV {

    static Capturo_Num_SICOV() {
        cy.task('ejecutar_query_oracle', {
            statement: 'SELECT * FROM CSWHABILITACIONPNJ.RP_SICOV'
        }).then((response) => {
            cantidad_registros = response.rows.length
        })
    }

    static Steps_Formulario_SICOV() {
        cy.wait(4000)
        cy.get(buttonMenu).click({force: true})
        cy.contains(buttonRadicar, {timeout: 180000}).click({force: true})
        cy.contains(buttonRegistraSolu,{timeout: 180000}).click({force: true})
        cy.contains(buttonSICOV,{timeout: 180000}).click({force: true})
        cy.url({ timeout: 180000}).should('include', '/sicov') 
    }

    static ObtenerDataPersonaJurifica() {
        cy.task('ejecutar_query_oracle', {
            statement: "SELECT SOLICITUD_ID, SOLICITUD_TIPO_DOCUMENTO, SOLICITUD_NUM_DOCUMENTO, ESTABLECI_MAT_MERCANTIL, FK_DIVIPOLA_OT FROM CSWHABILITACIONPNJ.RP_SOLICITUD WHERE NOT EXISTS (SELECT NULL FROM CSWHABILITACIONPNJ.RP_SICOV WHERE FK_ID_SOLICITUD = SOLICITUD_ID) AND FK_TIPOPRESTADOR_ID = 11 AND SOLICITUD_ESTADO = 'APROBADA'AND ESTABLECI_MAT_MERCANTIL IS NOT NULL OR FK_DIVIPOLA_OT IS NOT NULL"
        }).then((response) => {
            
             dataNIT = response.rows[99].SOLICITUD_NUM_DOCUMENTO
        })
    }

    static Llenado_de_campos(){
        cy.contains(buttonAgregarContrato,{timeout: 180000}).click({force: true})
        cy.contains('Información datos del contrato SICOV').should('exist')
        cy.wait(8000)
        cy.get(TipoDOC, {timeout: 180000}).select('NIT')
        cy.contains('Tipo documento persona jurídica:').should('exist')
        cy.get(NumeroDOC).type(dataNIT)
        cy.contains('Registro del CDA por:').should('exist')
        cy.get(SelectTipoRegistro).select(ValorSelectTipoRegistro)
        cy.contains(' Buscar ').should('exist').click({force:true})
        cy.get(inputNumcontrato).type(NumeroContrato)
        cy.contains('Fecha inicio de vigencia').should('exist')
        cy.contains('Fecha de vencimiento').should('exist')
        cy.get(buttonFechaInicio).click()
        cy.get(buttonDiaFechaInicio).click()
        cy.get(ButtonFechaFin).click()
        cy.get(ButtonDiaFechaFin).click()
        cy.get(buttonAdjuntar).attachFile(filePath)
    }

    static Valido_button_guardar(){
        cy.contains(ButtonGuardar, {timeout: 20000}).should('exist').click({ force: true })
        cy.wait(5000)
        cy.contains('Aceptar').click()
        cy.wait(3000)
        cy.contains('Aceptar').click()
        cy.log(pathScript)
        cy.wait(10000)

        
        //{failOnNonZeroExit: false}
        cy.exec(RutaScript, {failOnNonZeroExit: false}).then((result) => {
            if(result.code === 0){
                cy.log('La ejecucion del script para firmar fue exitosa')
            } else {
                cy.log('la ejecucucion fallo')
            }
        })
    }
}

export default ClasesContratoSICOV