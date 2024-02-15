let cantida_registros;
let data_veiculos_color;
const Ajv = require("ajv");
 
const schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            idValidacion: {type: 'number'},
            respuestaValidacion: {
                type: 'object',
                properties: {
                    codigoRespuesta: {type: 'string'},
                    mensaje: {type: ['null', 'string']},
                    fecha: {type: 'string', pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$'},
                    exitoso: {type: 'boolean'}
                }, required: ['codigoRespuesta', 'mensaje', 'fecha', 'exitoso']
            }
        }, required: ['idValidacion', 'respuestaValidacion']
    }
}
 
 
class pruebas{
 
    static ObtenerDataLog() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
                        FROM CSWHABILITACIONPNJ.GE_LOGVALIDA
                        WHERE LOGVALIDA_TIPOVALID_CODVALIDA = 'CUR01513'
                          AND TRUNC(LOGVALIDA_FECHORA) = TO_DATE(sysdate, 'DD/MM/YY')
                        ORDER BY LOGVALIDA_FECHORA desc`,
        }).then(function(resultados) {
            cantida_registros = resultados.rows.length
        })
    }
 
    static ObtenerDataPlaca() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
                        FROM runtprod.ra_automotor auto
                        WHERE auto.automotor_placa_numplaca IS NOT NULL
                          AND auto.automotor_estavehic_nombre = 'ACTIVO'
                          AND auto.automotor_ensenaza = 'S'
                          AND auto.automotor_color_idcolor = 8
                          AND ROWNUM <= 1`,
        }).then(resultados => {
            data_veiculos_color = resultados.rows[0]
    })
    }
 
    static EjecutarServicio() {
        cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validar/validacionColorCea',
            body: {
                "idSolicitud": 37,
                "placa": [
                    data_veiculos_color['AUTOMOTOR_PLACA_NUMPLACA']]
            }
        }).then(response => {
            expect(response.status).to.eq(200)
            expect(response.body[0]['respuestaValidacion']["exitoso"]).to.eq(true)
            expect(response.body[0]['respuestaValidacion']["mensaje"]).to.eq(null)
        })
    }
 
    static CompararDataLog() {
          cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
                        FROM CSWHABILITACIONPNJ.GE_LOGVALIDA
                        WHERE LOGVALIDA_TIPOVALID_CODVALIDA = 'CUR01513'
                          AND TRUNC(LOGVALIDA_FECHORA) = TO_DATE(sysdate, 'DD/MM/YY')
                        ORDER BY LOGVALIDA_FECHORA desc`,
        }).then(resultados => {
            expect(resultados.rows.length, "Se registro correctamente el log en BD").to.eq(cantida_registros + 1)
        })    
    }
 
    static CompararDataLog2() {
        cy.task('ejecutar_query_oracle', {
          statement: `SELECT *
                      FROM CSWHABILITACIONPNJ.GE_LOGVALIDA
                      WHERE LOGVALIDA_TIPOVALID_CODVALIDA = 'CUR01513'
                        AND TRUNC(LOGVALIDA_FECHORA) = TO_DATE(sysdate, 'DD/MM/YY')
                      ORDER BY LOGVALIDA_FECHORA desc`,
      }).then(resultados => {
          expect(resultados.rows.length, "Se registro correctamente el log en BD").to.eq(cantida_registros + 2)
      })    
  }
 
    static ActualizandoData() {
        cy.task('ejecutar_query_oracle', {
            statement: `UPDATE runtprod.ra_automotor auto
                        SET auto.automotor_color_idcolor = 1
                        WHERE auto.automotor_placa_numplaca = '${data_veiculos_color['AUTOMOTOR_PLACA_NUMPLACA']}'`,
        })
    }
}
 
export default pruebas