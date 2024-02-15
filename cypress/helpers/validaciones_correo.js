import {ValidacionesApi} from "./validaciones_api";
import base64url from "base64url";

export class ApiGmail {

    static validar_mensaje_correo(mensaje_correo, mensaje_validacion) {
        const validacion_mensaje = mensaje_correo.includes(mensaje_validacion)
        expect(validacion_mensaje, 'El mensaje del correo es el correcto').to.eq(true)
    }

    static descargar_archivo_correo(nombre_adjunto, datos) {
        cy.writeFile(`cypress/downloads/${nombre_adjunto}`, datos, 'utf-8')
    }

    static generar_token_acceso() {
        return cy.request({
            method: 'POST', url: 'https://www.googleapis.com/oauth2/v4/token', body: {
                "grant_type": Cypress.env('GRANT_TYPE'),
                "client_id": Cypress.env('CLIENT_ID'),
                "client_secret": Cypress.env('CLIENT_SECRET'),
                "refresh_token": Cypress.env('REFRESH_TOKEN')
            }
        })
    }

    static obtener_correos(access_token) {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env('USER_ID')}/messages`,
            headers: {Authorization: `Bearer ${access_token}`}
        })
    }

    static obtener_correo(access_token, id_mensaje) {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env('USER_ID')}/messages/${id_mensaje}`,
            headers: {Authorization: `Bearer ${access_token}`}
        })
    }

    static eliminar_correo(access_token, id_mensaje) {
        return cy.request({
            method: 'DELETE',
            url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env('USER_ID')}/messages/${id_mensaje}`,
            headers: {Authorization: `Bearer ${access_token}`}
        })
    }

    static obtener_adjunto_correo(access_token, id_mensaje, id_adjunto) {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env('USER_ID')}/messages/${id_mensaje}/attachments/${id_adjunto}`,
            headers: {Authorization: `Bearer ${access_token}`}
        })
    }

    static vaciar_buzon() {
        let bandera = true
        let id_mensajes = []
        let access_token;

        beforeEach('Generando token de acceso Gmail', () => {
            ApiGmail.generar_token_acceso().then((response) => {
                ValidacionesApi.validar_status_code(response, 200, 'El token se ha generado correctamente')
                access_token = response.body['access_token']
            })
        })

        it('Validar buzón de mensajes Gmail', () => {
            ApiGmail.obtener_correos(access_token).then((response) => {
                ValidacionesApi.validar_status_code(response, 200, 'Se consultó el buzón de mensajes correctamente')
                const messages = response.body['messages'];
                if (messages !== undefined) {
                    messages.forEach(message => {
                        id_mensajes.push(message['id'])
                    })
                } else {
                    bandera = false
                }
            })
        });

        it('Vaciar buzón de mensajes Gmail', () => {
            if (bandera) {
                id_mensajes.forEach(id_mensaje => {
                    ApiGmail.eliminar_correo(access_token, id_mensaje).then(response => {
                        ValidacionesApi.validar_status_code(response, 204, 'Se eliminó el mensaje correctamente')
                    })
                })
            }
        });
    }

    static validar_correo_notificaciones_oa(id_notificacion, test) {

        describe(`${test}`, () => {

            let access_token;
            let id_mensaje;
            let id_adjunto;
            let nombre_adjunto;
            let mensaje_correo;
            let fecha_actual = new Date().toLocaleDateString('en-UK');
            let data_parametros;

            beforeEach('Generar token de acceso Gmail', () => {
                ApiGmail.generar_token_acceso().then((response) => {
                    ValidacionesApi.validar_status_code(response, 200, 'El token se ha generado correctamente')
                    access_token = response.body['access_token']
                })
            })

            it('Consultando parámetros del sistema OA2', () => {
                cy.log(fecha_actual)
                cy.task('ejecutar_query_oracle', {
                    statement: "SELECT\n" +
                        "    *\n" +
                        "FROM\n" +
                        "    cswhabilitacionpnj.pa_parametrosistema_oa2\n" +
                        "WHERE\n" +
                        "    parametro_clave LIKE '%NOA_MIN%'\n" +
                        "    OR parametro_clave LIKE '%NOA_PERIODO_MIN%'"
                }).then(results => {
                    data_parametros = results.rows
                })
            });

            it('Validar buzón de mensajes', () => {
                ApiGmail.obtener_correos(access_token).then((response) => {
                    ValidacionesApi.validar_status_code(response, 200, 'Se consultó el buzón de mensajes correctamente')
                    id_mensaje = response.body.messages[0]['id'];
                })
            });

            it('Validar el correo correspondiente a la notificación', () => {
                cy.task('ejecutar_query_oracle', {
                    statement: `SELECT *
                                FROM CSWHABILITACIONPNJ.PA_NOTIFICACIONES
                                WHERE NOTIFICACION_ID = '${id_notificacion}'`
                }).then(results => {
                    ApiGmail.obtener_correo(access_token, id_mensaje).then((response) => {
                        ValidacionesApi.validar_status_code(response, 200, 'Se consultó el correo de manera correcta')
                        id_mensaje = response.body['id']
                        const adjunto = response.body['payload']['parts'][1]
                        const contenido_correo = response.body['payload']['parts'][0]
                        nombre_adjunto = adjunto.filename
                        let mensaje_validacion = results.rows[0]['NOTIFICACION_CUERPO']
                        mensaje_validacion = mensaje_validacion.replace('[FECHA_SISTEMA]', fecha_actual)
                        mensaje_validacion = mensaje_validacion.replace('[ARCHIVO_ADJUNTO]', nombre_adjunto)
                        if (mensaje_validacion.includes('[MIN_CERTIFICADOS_CRC]') && mensaje_validacion.includes('[PERIODO_MIN_CERTIFICADOS_CRC]')) {
                            data_parametros.forEach(parametro => {
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_MIN_CERTIFICADOS_CRC') {
                                    mensaje_validacion = mensaje_validacion.replace('[MIN_CERTIFICADOS_CRC]', parametro['PARAMETRO_VALOR'])
                                }
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_PERIODO_MIN_CERTIFICADOS_CRC') {
                                    mensaje_validacion = mensaje_validacion.replace('[PERIODO_MIN_CERTIFICADOS_CRC]', parametro['PARAMETRO_VALOR'])
                                }
                            })
                        }
                        if (mensaje_validacion.includes('[MIN_CERTIFICADOS_CEA]') && mensaje_validacion.includes('[PERIODO_MIN_CERTIFICADOS_CEA]')) {
                            data_parametros.forEach(parametro => {
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_MIN_CERTIFICADOS_CEA') {
                                    mensaje_validacion = mensaje_validacion.replace('[MIN_CERTIFICADOS_CEA]', parametro['PARAMETRO_VALOR'])
                                }
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_PERIODO_MIN_CERTIFICADOS_CEA') {
                                    mensaje_validacion = mensaje_validacion.replace('[PERIODO_MIN_CERTIFICADOS_CEA]', parametro['PARAMETRO_VALOR'])
                                }
                            })
                        }
                        if (mensaje_validacion.includes('[MIN_CERTIFICADOS_CDA]') && mensaje_validacion.includes('[PERIODO_MIN_CERTIFICADOS_CDA]')) {
                            data_parametros.forEach(parametro => {
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_MIN_CERTIFICADOS_CDA') {
                                    mensaje_validacion = mensaje_validacion.replace('[MIN_CERTIFICADOS_CDA]', parametro['PARAMETRO_VALOR'])
                                }
                                if (parametro['PARAMETRO_CLAVE'] === 'NOA_PERIODO_MIN_CERTIFICADOS_CDA') {
                                    mensaje_validacion = mensaje_validacion.replace('[PERIODO_MIN_CERTIFICADOS_CDA]', parametro['PARAMETRO_VALOR'])
                                }
                            })
                        }
                        if(mensaje_validacion.includes('.zip')){
                            mensaje_validacion=mensaje_validacion.replace('.zip','');
                        }
                        id_adjunto = adjunto.body['attachmentId']
                        mensaje_correo = base64url.decode(contenido_correo.body['data'], 'utf8')
                        cy.log(mensaje_validacion);
                        ApiGmail.descargar_archivo_correo('contenido.txt', mensaje_correo)
                        ApiGmail.validar_mensaje_correo(mensaje_correo, mensaje_validacion)
                    })
                })
            });

            it('Validar archivo adjunto', () => {
                ApiGmail.obtener_adjunto_correo(access_token, id_mensaje, id_adjunto).then((response) => {
                    ValidacionesApi.validar_status_code(response, 200, 'Se consultó el archivo adjunto correctamente')
                    ValidacionesApi.comprobar_extension_archivo(nombre_adjunto, ['.csv', '.zip'], 'La extensión del archivo es la correcta')
                    const datos = new Buffer(response.body.data, 'base64')
                    ApiGmail.descargar_archivo_correo(nombre_adjunto, datos)
                })
            });
        })
    }
}