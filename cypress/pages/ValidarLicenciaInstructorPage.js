// Librería que permite validar el schema del response
const Ajv = require("ajv");
// Variable que va a tomar como valor el número de documento de un instructor
let numeroDocumento;
// Variable que va a tomar como valor el tipo de documento de un instructor
let tipoDocumento;
// Variable que toma como valor la categoría asignada al instructor
let categoriaLicencia;
// Variable que va a tomar como valor la respuesta obtenida del servicio
let respuesta;
// Schema del servicio coordinar validaciones vehículos
const schema = {
    type: 'object', properties: {
        codigoRespuesta: {type: 'string'}, mensaje: {
            type: ['string', 'null']
        }, fecha: {
            type: 'string', pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$'
        }, exitoso: {type: 'boolean'}
    }, required: ['codigoRespuesta', 'mensaje', 'fecha', 'exitoso']
};

// Clase que contiene métodos necesarios para la validación del caso de uso CUR01515
export class ValidarLicenciaInstructor {

    // Consultando en la base de datos el instructor - Licencia activa y vigente
    static consultarIntructorConLicenciaConduccion() {
        return cy.task('ejecutar_query_oracle', {
            statement: `SELECT DISTINCT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            licc.licecondu_nrolicenc           AS numero_licencia_conduccion,
            licc.licecondu_fechexped           AS fecha_expedicion,
            licc.licecondu_fechvenci           AS fecha_vencimiento,
            licc.licecondu_estliccon_nombre    AS estado_licencia_conduccion,
            licc.licecondu_categoria_idcategor AS categoria_licencia_conduccion,
            cat.ceraptcon_categoria            AS cetificado_enseñanza
        FROM
                 runtprod.ev_liceinstr ins
            INNER JOIN runtprod.tr_persnatur natur ON ( ins.liceinstr_persnatur_idpersona = natur.persnatur_persona_idpersona )
            INNER JOIN runtprod.ev_licecondu licc ON ( ins.liceinstr_licecondu_nrolicenc = licc.licecondu_nrolicenc )
            INNER JOIN runtprod.tr_persona   per ON ( natur.persnatur_persona_idpersona = per.persona_idpersona )
            INNER JOIN runtprod.re_ceraptcon cat ON ( licc.licecondu_certensen_nrocerens = cat.ceraptcon_nrocertif )
        WHERE
                ins.liceinstr_estliccon_nombinstr = 'ACTIVA'
            AND licc.licecondu_estliccon_nombre = 'ACTIVA'
            AND per.persona_estaperso_nombre = 'ACTIVA'
            AND licc.licecondu_fechvenci > sysdate
            AND cat.ceraptcon_categoria IS NOT NULL
            AND licc.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1
        ORDER BY
            per.persona_idpersona`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA_LICENCIA_CONDUCCION'];
        })
    }

    static consultarIntructorSinLicenciaConduccion() {
        return cy.task('ejecutar_query_oracle', {
            statement: `SELECT
            per.persona_tipoident_idtipdoc,
            per.persona_nrodocume
        FROM
            runtprod.tr_persona   per
            LEFT JOIN runtprod.ev_licecondu licc ON per.persona_idpersona = licc.licecondu_persnatur_idpersona
        WHERE
            licc.licecondu_persnatur_idpersona IS NULL
            AND per.persona_estaperso_nombre = 'ACTIVA'
            AND per.persona_tipoident_idtipdoc = 'C'
            AND ROWNUM <= 1`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['PERSONA_TIPOIDENT_IDTIPDOC'];
            numeroDocumento = registro.rows[0]['PERSONA_NRODOCUME'];
            cy.log(registro.rows)
        })
    }

    // Consumo del servicio coordinar validaciones vehículos - Sin licencia
    static consumirServicioValidarInstructorSinLicencia() {
        return cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validaciones/validarLicenciaConduccion',
            body: {
                "tipoDocumento": tipoDocumento,
                "numeroDocumento": numeroDocumento,
                "categoria": [categoriaLicencia],
                "idSolicitud": 37
            }
        }).then(response => {
            respuesta = response
        })
    }
    
    // Consumo del servicio coordinar validaciones vehículos - Sin licencia
    static consumirServicioValidarInstructorCategorias() {
        return cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validaciones/validarLicenciaConduccion',
            body: {
                "tipoDocumento": tipoDocumento,
                "numeroDocumento": numeroDocumento,
                "categoria": ['H2'],
                "idSolicitud": 37
            }
        }).then(response => {
            respuesta = response
        })
    }

    // Consumo del servicio coordinar validaciones vehículos - Con licencia
    static consumirServicioValidarIntructorConLicencia() {
        return cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validaciones/validarLicenciaConduccion',
            body: {
                "tipoDocumento": tipoDocumento,
                "numeroDocumento": numeroDocumento,
                "categoria": [categoriaLicencia],
                "idSolicitud": 37
            }
        }).then(response => {
            respuesta = response
        })
    }

     // Consultando en la base de datos el instructor - Licencia no activa
     static consultarIntructorConLicenciaConduccionNoActiva() {
        return cy.task('ejecutar_query_oracle', {
            statement: `SELECT DISTINCT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            licc.licecondu_nrolicenc           AS numero_licencia_conduccion,
            licc.licecondu_fechexped           AS fecha_expedicion,
            licc.licecondu_fechvenci           AS fecha_vencimiento,
            licc.licecondu_estliccon_nombre    AS estado_licencia_conduccion,
            licc.licecondu_categoria_idcategor AS categoria_licencia_conduccion,
            cat.ceraptcon_categoria            AS cetificado_enseñanza
        FROM
                 runtprod.ev_liceinstr ins
            INNER JOIN runtprod.tr_persnatur natur ON ( ins.liceinstr_persnatur_idpersona = natur.persnatur_persona_idpersona )
            INNER JOIN runtprod.ev_licecondu licc ON ( ins.liceinstr_licecondu_nrolicenc = licc.licecondu_nrolicenc )
            INNER JOIN runtprod.tr_persona   per ON ( natur.persnatur_persona_idpersona = per.persona_idpersona )
            INNER JOIN runtprod.re_ceraptcon cat ON ( licc.licecondu_certensen_nrocerens = cat.ceraptcon_nrocertif )
        WHERE
                ins.liceinstr_estliccon_nombinstr = 'ACTIVA'
            AND licc.licecondu_estliccon_nombre = 'CANCELADA'
            AND per.persona_estaperso_nombre = 'ACTIVA'
            AND licc.licecondu_fechvenci > sysdate
            AND cat.ceraptcon_categoria IS NOT NULL
            AND licc.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1
        ORDER BY
            per.persona_idpersona`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA_LICENCIA_CONDUCCION'];
        })
    }

    // Consultando en la base de datos el instructor - Licencia no activa
    static consultarIntructorConLicenciaConduccionVencida() {
        return cy.task('ejecutar_query_oracle', {
            statement: `SELECT DISTINCT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            licc.licecondu_nrolicenc           AS numero_licencia_conduccion,
            licc.licecondu_fechexped           AS fecha_expedicion,
            licc.licecondu_fechvenci           AS fecha_vencimiento,
            licc.licecondu_estliccon_nombre    AS estado_licencia_conduccion,
            licc.licecondu_categoria_idcategor AS categoria_licencia_conduccion,
            cat.ceraptcon_categoria            AS cetificado_enseñanza
        FROM
                 runtprod.ev_liceinstr ins
            INNER JOIN runtprod.tr_persnatur natur ON ( ins.liceinstr_persnatur_idpersona = natur.persnatur_persona_idpersona )
            INNER JOIN runtprod.ev_licecondu licc ON ( ins.liceinstr_licecondu_nrolicenc = licc.licecondu_nrolicenc )
            INNER JOIN runtprod.tr_persona   per ON ( natur.persnatur_persona_idpersona = per.persona_idpersona )
            INNER JOIN runtprod.re_ceraptcon cat ON ( licc.licecondu_certensen_nrocerens = cat.ceraptcon_nrocertif )
        WHERE
                ins.liceinstr_estliccon_nombinstr = 'ACTIVA'
            AND licc.licecondu_estliccon_nombre = 'ACTIVA'
            AND per.persona_estaperso_nombre = 'ACTIVA'
            AND licc.licecondu_fechvenci < sysdate
            AND cat.ceraptcon_categoria IS NOT NULL
            AND licc.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1
        ORDER BY
            per.persona_idpersona`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA_LICENCIA_CONDUCCION'];
        })
    }

    // Validación del código de estado de la respuesta obtenida del servicio
    static validarStatusCode() {
        expect(respuesta.status, 'API responde con 200').to.eq(200);
    }

    // Validación del mensaje de la causal de rechazo
    static validarMensajeExitoso() {
        expect(respuesta.body['mensaje']).to.eq(null);
    }

    static valdiarMensajeSinLicencia() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con ${tipoDocumento}. ${numeroDocumento} no tiene registrada una licencia de conducción.`);
    }

    static validarMesajeLicenciaNoActiva() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con C${numeroDocumento} tiene registrada una licencia de conducción en estado diferente a Activo para la categoría [${categoriaLicencia}].`);
    }

    static validarMesajeLicenciaVencida() {
        expect(respuesta.body['mensaje']).to.eq(`La categoría [${categoriaLicencia}] de la licencia de conducción del instructor identificado con ${tipoDocumento}${numeroDocumento} no se encuentra Vigente.`);
    }

    static validarMesajeCategorias() {
        expect(respuesta.body['mensaje']).to.eq(`La categoría de la licencia de conducción del instructor identificado con C${numeroDocumento} no se encuentra dentro de las categorías seleccionadas para el instructor`);
    }

    // Validación del schema de la respuesta obtenida del servicio
    static ValidarSchemaRespuesta() {
        const ajv = new Ajv();
        const validacion = ajv.compile(schema);
        const es_valido = validacion(respuesta.body);
        expect(es_valido, `El esquema fue el correcto.`).to.be.true;
    }

}
