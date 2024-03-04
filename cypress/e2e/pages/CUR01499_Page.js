// Librería que permite validar el schema del response
const Ajv = require("ajv");
// Variable que va a tomar como valor un número de placa
let numeroPlaca;
// Variable que va a tomar como valor la respuesta obtenida del servicio
let respuesta;
// Schema del servicio coordinar validaciones vehículos
const schema = {
    type: 'object',
    items: {
        type: 'object',
        properties: {
            idValidacion: {
                type: "number"
            },
            respuestaValidacion: {
                type: 'object',
                properties: {
                    codigoRespuesta: {
                        type: 'string'
                    },
                    mensaje: {
                        type: ['string', 'null']
                    },
                    fecha: {
                        type: 'string',
                        pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$'
                    },
                    exitoso: {
                        type: 'boolean'
                    }
                },
                required: ['codigoRespuesta', 'mensaje', 'fecha', 'exitoso']
            }
        },
        required: ['idValidacion', 'respuestaValidacion']
    }
}

// Clase que contiene métodos necesarios para la validación del caso de uso CUR01499_Page
export class CUR01499_Page {

    // Habilitación de los párametros establecidos en la validación de vehículos
    static habilitarParametros() {
        cy.task('ejecutar_query_oracle', {
            statement: `UPDATE CSWHABILITACIONPNJ.PA_PARAMETROSISTEMA SET PARAMETRO_VALOR = 'ACTIVO'
            WHERE PARAMETRO_CLAVE LIKE 'VALIDADOR%'`,
        })
    }

    // Deshabilitación de los párametros establecidos en la validación de vehículos
    static deshabilitarParametros() {
        cy.task('ejecutar_query_oracle', {
            statement: `UPDATE CSWHABILITACIONPNJ.PA_PARAMETROSISTEMA SET PARAMETRO_VALOR = 'INACTIVO'
            WHERE PARAMETRO_CLAVE LIKE 'VALIDADOR%'`,
        })
    }

    // Consultando en la base de datos la placa de un vehículo
    static consultarPlacaBaseDeDatos() {
        return cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
            FROM RUNTPROD.RA_AUTOMOTOR AUTO
            WHERE AUTO.AUTOMOTOR_PLACA_NUMPLACA IS NOT NULL
            AND AUTO.AUTOMOTOR_ESTAVEHIC_NOMBRE = 'ACTIVO'
            AND ROWNUM <= 1`,
        }).then(registro => {
            numeroPlaca = registro.rows[0]['AUTOMOTOR_PLACA_NUMPLACA'];
        })
    }

    // Consumo del servicio coordinar validaciones vehículos
    static consumirServicioCoordinarValidacionesVehiculos() {
        return cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/coordinar/validacionesVehiculos',
            body: {
                "idSolicitud": 37,
                "placa": [`${numeroPlaca}`]
            }
        }).then(response => {
            respuesta = response
        })
    }

    // Validación del código de estado de la respuesta obtenida del servicio
    static validarStatusCode() {
        expect(respuesta.status, 'API responde con 200').to.eq(200);
    }

    // Validación de la cantidad de registros obtenidos de la respuesta del servicio
    static validarCantidadRegistrosResponse(cantidad) {
        expect(respuesta.body.length).to.eq(cantidad);
    }

    // Validación del schema de la respuesta obtenida del servicio
    static ValidarSchemaRespuesta() {
        let validacionEsquema;
        respuesta.body.forEach((obj)=> {
            const ajv = new Ajv();
            validacionEsquema = ajv.compile(schema);
            const es_valido = validacionEsquema(obj);
            expect(es_valido, `El esquema que contiene el siguiente id: ${obj['idValidacion']} es correcto`).to.be.true;
        })
    }

}