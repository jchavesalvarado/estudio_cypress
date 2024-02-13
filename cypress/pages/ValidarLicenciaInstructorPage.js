// Librería que permite validar el schema del response
const Ajv = require("ajv");
// Variable que va a tomar como valor el número de documento de un instructor
let numeroDocumento;
// Variable que va a tomar como valor el tipo de documento de un instructor
let tipoDocumento;
// Variable que toma como valor una de las categorías del instructor
let categoriaLicencia;
// Variable que va a tomar como valor la respuesta obtenida del servicio
let respuesta;
// Variable que va a tomar como valor todas las categorías del instructor
let categoriasInstructor = [];
// Variable que va a tomar como valor las categorías del CEA
let categoriasCea = [];
// Varaible que va a tomar como valor las categorías del instructor que no corresponden con las del CEA
let categoriasQueNoCorresponden = [];
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

    // Consultando instructor - Con licencia
    static consultarIntructorConLicenciaConduccion() {
        cy.task('ejecutar_query_oracle', {
            statement: `
        SELECT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            catl.catliccon_categoria_idcategor AS categoria,
            licecondu_nrolicenc AS numero_licencia
        FROM
                 runtprod.tr_persona per
            JOIN runtprod.ev_licecondu lic ON lic.licecondu_persnatur_idpersona = per.persona_idpersona
            LEFT JOIN runtprod.rc_catliccon catl ON catl.catliccon_licecondu_nrolicenc = lic.licecondu_nrolicenc
        WHERE
            lic.licecondu_estliccon_nombre IN ( 'ACTIVA' )
            AND ( lic.licecondu_fechvenci > sysdate
                  OR catl.catliccon_fechvenci > sysdate )
            AND catl.catliccon_categoria_idcategor IS NOT NULL
            AND lic.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA'];
        })
    }

    // Consultando instructor - Sin licencia
    static consultarIntructorSinLicenciaConduccion() {
        cy.task('ejecutar_query_oracle', {
            statement: `
        SELECT
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
        })
    }

    // Consumo del servicio validar licencia instructor - Categorías no corresponden
    static consumirServicioValidarInstructorCategorias() {
        ValidarLicenciaInstructor.consultarCategoriasQueNoCorresponden();
        cy.request({
            method: 'POST',
            url: 'https://az-hub-dev-apim-dev-cus-000.azure-api.net/OAValidacionesMS/validaciones/validarLicenciaConduccion',
            body: {
                "tipoDocumento": tipoDocumento,
                "numeroDocumento": numeroDocumento,
                "categoria": categoriasQueNoCorresponden,
                "idSolicitud": 37
            }
        }).then(response => {
            respuesta = response
        })
    }

    // Consumo del servicio validar licencia instructor - Categorías corresponden
    static consumirServicioValidarIntructor() {
        cy.request({
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

     // Consultando instructor - Licencia no activa
     static consultarIntructorConLicenciaConduccionNoActiva() {
        cy.task('ejecutar_query_oracle', {
            statement: `
        SELECT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            catl.catliccon_categoria_idcategor AS categoria
        FROM
                 runtprod.tr_persona per
            JOIN runtprod.ev_licecondu lic ON lic.licecondu_persnatur_idpersona = per.persona_idpersona
            LEFT JOIN runtprod.rc_catliccon catl ON catl.catliccon_licecondu_nrolicenc = lic.licecondu_nrolicenc
        WHERE
            licecondu_persnatur_idpersona NOT IN (
                SELECT
                    licecondu_persnatur_idpersona
                FROM
                    runtprod.ev_licecondu
                WHERE
                    licecondu_estliccon_nombre = 'ACTIVA'
            )
            AND lic.licecondu_estliccon_nombre <> 'ACTIVA'
            AND catl.catliccon_categoria_idcategor IS NOT NULL
            AND lic.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA'];
        })
    }

    // Consultando instructor - Licencia no vigente
    static consultarIntructorConLicenciaConduccionVencida() {
        cy.task('ejecutar_query_oracle', {
            statement: `
        SELECT
            per.persona_idpersona              AS id_persona,
            per.persona_tipoident_idtipdoc     AS tipo_documento,
            per.persona_nrodocume              AS numero_documento,
            catl.catliccon_categoria_idcategor AS categoria
        FROM
                 runtprod.tr_persona per
            JOIN runtprod.ev_licecondu lic ON lic.licecondu_persnatur_idpersona = per.persona_idpersona
            LEFT JOIN runtprod.rc_catliccon catl ON catl.catliccon_licecondu_nrolicenc = lic.licecondu_nrolicenc
        WHERE
            lic.licecondu_estliccon_nombre IN ( 'ACTIVA' )
            AND NOT ( lic.licecondu_fechvenci > sysdate
                  OR catl.catliccon_fechvenci > sysdate )
            AND catl.catliccon_categoria_idcategor IS NOT NULL
            AND lic.licecondu_categoria_idcategor IS NOT NULL
            AND ROWNUM <= 1`,
        }).then(registro => {
            tipoDocumento = registro.rows[0]['TIPO_DOCUMENTO'];
            numeroDocumento = registro.rows[0]['NUMERO_DOCUMENTO'];
            categoriaLicencia = registro.rows[0]['CATEGORIA'];
        })
    }

    // Consultando categorías del instructor que no corresponden con las del CEA
    static consultarCategoriasQueNoCorresponden() {
        cy.task('ejecutar_query_oracle', {
            statement: `
            SELECT DISTINCT
                ca.catlicins_categoria_idcategor
            FROM
                     runtprod.tr_persona pn
                INNER JOIN runtprod.ev_liceinstr lc ON ( pn.persona_idpersona = lc.liceinstr_persnatur_idpersona )
                LEFT JOIN runtprod.ev_catlicins ca ON ( lc.liceinstr_nrolicenc = ca.catlicins_liceinstr_nrolicenc )
            WHERE
                    1 = 1
                AND pn.persona_tipoident_idtipdoc = 'C'
                AND pn.persona_nrodocume = '${numeroDocumento}'
                AND LICEINSTR_ESTLICCON_NOMBRE = 'ACTIVA'
                AND LICEINSTR_FECHVENCI >= sysdate
            ORDER BY
                catlicins_categoria_idcategor DESC`,
        }).then(consulta => {
            let registros = consulta.rows;
            registros.forEach(element => {
                categoriasInstructor.push(element['CATLICINS_CATEGORIA_IDCATEGOR']);
            });
            cy.task('ejecutar_query_oracle', {
                statement: `
            SELECT DISTINCT
                categorialic_des_categoria
            FROM
                     cswhabilitacionpnj.rp_solicitud
                INNER JOIN cswhabilitacionpnj.rp_cea ON ( cea_id = fk_cea_id )
                INNER JOIN cswhabilitacionpnj.rp_categorialic ON ( fk_categoriacea_id = cea_id )
            WHERE
                    1 = 1
                AND solicitud_id = '955'`,
            }).then(consulta => {
                let registros = consulta.rows;
                registros.forEach(element => {
                    categoriasCea.push(element['CATEGORIALIC_DES_CATEGORIA']);
                });
                categoriasInstructor.forEach(element => {
                    if(!(categoriasCea.includes(element))) {
                        categoriasQueNoCorresponden.push(element)
                    }
                })
            })
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

    // Validación del mensaje de la causal de rechazo: Sin licencia
    static valdiarMensajeSinLicencia() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con ${tipoDocumento}. ${numeroDocumento} no tiene registrada una licencia de conducción.`);
    }

    // Validación del mensaje de la causal de rechazo: Licencia no activa
    static validarMesajeLicenciaNoActiva() {
        expect(respuesta.body['mensaje']).to.eq(`El instructor identificado con C${numeroDocumento} tiene registrada una licencia de conducción en estado diferente a Activo para la categoría [${categoriaLicencia}].`);
    }

    // Validación del mensaje de la causal de rechazo: Licencia vencida
    static validarMesajeLicenciaVencida() {
        expect(respuesta.body['mensaje']).to.eq(`La categoría ${categoriaLicencia} de la licencia de conducción del instructor identificado con ${tipoDocumento}${numeroDocumento} no se encuentra Vigente.`);
    }

    // Validación del mensaje de la causal de rechazo: Las categorías no corresponden
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
