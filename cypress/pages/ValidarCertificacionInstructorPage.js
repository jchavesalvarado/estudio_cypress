const Ajv = require("ajv");
let tipo_documento;
let numero_documento;
let respuesta;
let cantidadInicialDeRegistros;
let cantidadFinalDeRegistros;
const schema = {
    type: 'object', properties: {
        codigoRespuesta: {type: 'string'},
        mensaje: {
            type: ['string', 'null']
        },
        fecha: {type: 'string', pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$'},
        exitoso: {type: 'boolean'}
    }, required: ['codigoRespuesta', 'mensaje', 'fecha', 'exitoso']
};

export class ValidarCertificacionInstructor {

    static consultarInstructorConCertificacion() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT per.persona_tipoident_idtipdoc,
                               per.persona_nrodocume
                        FROM runtprod.tr_persona per
                                 JOIN runtprod.ev_liceinstr lic
                                      ON lic.liceinstr_persnatur_idpersona = per.persona_idpersona
                        WHERE lic.liceinstr_estliccon_nombinstr = 'ACTIVA'
                          AND lic.liceinstr_fechvenci > sysdate
                          AND ROWNUM <= 100`,
        }).then(registros => {
            tipo_documento = registros.rows[0]['PERSONA_TIPOIDENT_IDTIPDOC'];
            numero_documento = registros.rows[0]['PERSONA_NRODOCUME'];
        })
    }

    static consultarCantidadInicialDeRegistrosTablaLog() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
                            FROM CSWHABILITACIONPNJ.GE_LOGVALIDA
                            WHERE LOGVALIDA_TIPOVALID_CODVALIDA = 'CUR01617'
                              AND TRUNC(LOGVALIDA_FECHORA) = TO_DATE(sysdate, 'DD/MM/YY')
                            ORDER BY LOGVALIDA_FECHORA desc`
        }).then(registros => {
            cantidadInicialDeRegistros = registros.rows.length
        })
    }

    static consultarCantidadFinalDeRegistrosTablaLog() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT *
                            FROM CSWHABILITACIONPNJ.GE_LOGVALIDA
                            WHERE LOGVALIDA_TIPOVALID_CODVALIDA = 'CUR01617'
                              AND TRUNC(LOGVALIDA_FECHORA) = TO_DATE(sysdate, 'DD/MM/YY')
                            ORDER BY LOGVALIDA_FECHORA desc`
        }).then(registros => {
            cantidadFinalDeRegistros = registros.rows.length
        })
    }

    static validarRegistroLogEnLaBaseDeDatos() {
        expect(cantidadFinalDeRegistros).to.eq(cantidadInicialDeRegistros + 1, `Se registró correctamente el log en la base de datos correspondiente a la notificación CUR01515`)
    }

    static consultarInstructorSinCertificacion() {
        cy.task('ejecutar_query_oracle', {
            statement: `
        SELECT
            per.persona_tipoident_idtipdoc,
            per.persona_nrodocume
        FROM
            runtprod.tr_persona   per
            LEFT JOIN runtprod.ev_liceinstr lic ON lic.liceinstr_persnatur_idpersona = per.persona_idpersona
        WHERE
            lic.liceinstr_nrolicenc IS NULL
            AND per.persona_nrodocume <> 'SIN REGISTRO'
                AND ROWNUM <= 1`,
        }).then(registros => {
            tipo_documento = registros.rows[0]['PERSONA_TIPOIDENT_IDTIPDOC'];
            numero_documento = registros.rows[0]['PERSONA_NRODOCUME'];
        })
    }

    static consultarInstructorConCertificacionNoActiva() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT
                            per.persona_tipoident_idtipdoc,
                            per.persona_nrodocume
                        FROM
                            runtprod.tr_persona per
                                JOIN runtprod.ev_liceinstr lic ON lic.liceinstr_persnatur_idpersona = per.persona_idpersona
                        WHERE
                            lic.liceinstr_estliccon_nombinstr <> 'ACTIVA'
                          AND ROWNUM <= 100`,
        }).then(registros => {
            tipo_documento = registros.rows[0]['PERSONA_TIPOIDENT_IDTIPDOC'];
            numero_documento = registros.rows[0]['PERSONA_NRODOCUME'];
        })
    }

    static consultarInstructorConCertificacionVencida() {
        cy.task('ejecutar_query_oracle', {
            statement: `SELECT per.persona_tipoident_idtipdoc,
                               per.persona_nrodocume
                        FROM runtprod.tr_persona per
                                 JOIN runtprod.ev_liceinstr lic
                                      ON lic.liceinstr_persnatur_idpersona = per.persona_idpersona
                        WHERE lic.liceinstr_estliccon_nombinstr = 'ACTIVA'
                          AND lic.liceinstr_fechvenci < sysdate
                          AND ROWNUM <= 100`,
        }).then(registros => {
            tipo_documento = registros.rows[0]['PERSONA_TIPOIDENT_IDTIPDOC']
            numero_documento = registros.rows[0]['PERSONA_NRODOCUME']
        })
    }

    static consumirServicioValidarInstructor() {
        cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validaciones/validarCertInstructor',
            body: {
                "idSolicitud": 37,
                "tipoDocum": `${tipo_documento}`,
                "numDocum": `${numero_documento}`
            }
        }).then(response => {
            respuesta = response;
        })
    }

    static validarStatusCode() {
        expect(respuesta.status, 'API responde con 200').to.eq(200);
    }

    static validarSchemaRespuesta() {
        const ajv = new Ajv();
        const validacion = ajv.compile(schema);
        const es_valido = validacion(respuesta.body);
        expect(es_valido, `El esquema fue el correcto.`).to.be.true;
    }

    static validarMensajeCertificacionActivaVigente() {
        expect(respuesta.body['mensaje']).to.eq(null);
    }

    static validarMensajeInstructorSinCertificacion() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con ${tipo_documento}. ${numero_documento} no cuenta con una certificación de instructor.`);
    }

    static validarMensajeInstructorConCertificacionNoActiva() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con ${tipo_documento}. ${numero_documento} no cuenta con una certificación de instructor en estado Activo.`);
    }

    static validarMensajeInstructorConCertificacionVencida() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con ${tipo_documento}. ${numero_documento} no cuenta con una certificación de instructor Vigente`);
    }

}