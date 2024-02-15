import {ApiGmail} from "./validaciones_correo";

const Ajv = require('ajv');

export class ValidacionesApi {

    static validar_schema(response, schema, mensaje) {
        const ajv = new Ajv();
        const validacion = ajv.compile(schema);
        const es_valido = validacion(response.body);
        expect(es_valido, `${mensaje}`).to.be.true;
    }

    static etapas_mocking(OA){
        //ETAPA 1
        cy.get('#cdk-step-content-0-0 > .mat-vertical-content > form.ng-untouched > :nth-child(2) > :nth-child(1) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', { timeout: 180000}).click({force: true})
        cy.contains(OA, { timeout: 180000}).click()
        cy.get('#cdk-step-content-0-0 > .mat-vertical-content > form.ng-invalid > :nth-child(2) > :nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', { timeout: 180000}).click({force: true})
        cy.contains('PERSONA JURÍDICA', { timeout: 180000}).click({force: true})
        //ETAPA 2
        cy.contains('Siguiente').click({force: true})
        //Actualiza la solicitud sin errores
        cy.intercept('POST', 'OARegistroCAMS/solicitud/actualizarSolicitud', {
            statusCode: 200, // Specify the desired status code
            body:
            {
                "error": false,
                "mensaje": "Se actualizo la solicitud correctamente",
                "codigo": null,
                "idSolicitud": 1385,
                "idCupl": null,
                "pdf": null
            }  // Optional response body
        }).as('ActualizarSolicitud')
        //ETAPA 3 BUSCAR MATRICULA MERCANTIL Y GENERA DIRECCION
        cy.get('#mat-input-31', {timeout: 180000}).type('164291', {force: true})
        cy.contains('Buscar').click({force: true})
        cy.contains('Editar').click({force: true})
        cy.get(':nth-child(1) > .form-control', { timeout: 180000}).select('CARRERA', {force: true})
        cy.get(':nth-child(3) > .form-control', { timeout: 180000}).type('3', {force: true})
        cy.get(':nth-child(6) > .form-control', { timeout: 180000}).type('5', {force: true})
        cy.get(':nth-child(8) > .form-control', { timeout: 180000}).type('89', {force: true})
        cy.contains('Generar Dirección', { timeout: 180000}).click({force: true})
        cy.intercept('POST', 'OARegistroCAMS/consulta/consultarSolicitud', {
            statusCode: 200,
            body: {
                    "error": false,
                    "mensaje": null,
                    "identificacion": "N 901191265-1",
                    "razonSocial": "CDA TUTECNO SAS",
                    "dv": "1",
                    "tipoSociedad": "SOCIEDAD COMERCIAL",
                    "departamento": "BOGOTA",
                    "municipio": "BOGOTA, D.C.",
                    "direccion": "CL  27  SUR # 29 C  42 - 50 - 54",
                    "telefono": "3118989609",
                    "email": "cdatutecno@gmail.com",
                    "actividadEconomica": "Ensayos y análisis técnicos",
                    "sigla": null,
                    "nroRegistorMercantil": "2976515",
                    "fechaMatricula": "22/06/2018",
                    "fechaRenovacion": "28/04/2022",
                    "organizacionJuridica": "SOCIEDADES POR ACCIONES SIMPLIFICADAS SAS",
                    "representantesLegales": [
                        {
                            "identificacion": 79741167,
                            "nombre": "ORLAY ALONSO BARRERA CARDENAS",
                            "tipoVinculo": "Representante Legal - Principal",
                            "tipoIdentificacion": "CEDULA DE CIUDADANIA"
                        },
                        {
                            "identificacion": 52521549,
                            "nombre": "ALEJANDRA RODRIGUEZ GONZALEZ",
                            "tipoVinculo": "Representante Legal - Suplente",
                            "tipoIdentificacion": "CEDULA DE CIUDADANIA"
                        }
                    ],
                    "propietarios": [],
                    "establecimientos": [
                        {
                            "codigoCamara": "04",
                            "nombreEstablecimiento": "CDA TUTECNO SAS",
                            "fechaMatricula": "15/07/2019",
                            "fechaRenovacion": "28/04/2022",
                            "actividadEconomica": "Ensayos y análisis técnicos",
                            "departamento": "Bogota D.C.",
                            "municipio": "BOGOTA",
                            "direccion": " CALLE 27 SUR # 29C42/50/54",
                            "telefono": "3118989609",
                            "email": "cdatutecno@gmail.com",
                            "matriculaMercantil": "3139068",
                            "tipoSociedad": "SOCIEDAD COMERCIAL",
                            "organizacionJuridica": "ESTABLECIMIENTOS DE COMERCIO",
                            "sigla": null,
                            "direccionNomenclatura": null,
                            "codigoDivipol": "11001000",
                            "autoridadTransito": null
                        }
                    ],
                    "establecimientoGuardado": null,
                    "prestadoServicio": "CDA",
                    "pasoActual": 1,
                    "estado": "EN PROCESO REGISTRO",
                    "tipoPersona": "PERSONA JURIDICA",
                    "certificado": null,
                    "idCertificado": null,
                    "fechaExpedicion": null,
                    "fechaVencimiento": null,
                    "entidadCertificadora": null,
                    "nombreRepLegal": null,
                    "tipoConformacion": 2,
                    "idDivipola": null,
                    "recuperadoRunt": false,
                    "direccionNomenclatura": null,
                    "matriculaCea": null,
                    "empresaOficialPublica": false,
                    "empresaOficial": false,
                    "esEmpresaOficialOT": false   
            }

        }).as('consultarSolicitud') 
        // ETAPA 4
        cy.contains('Siguiente', { timeout: 180000}).click({force: true})
        cy.get(':nth-child(9) > .mat-primary', { timeout: 180000}).click({force: true})
        cy.get('.swal2-confirm', { timeout: 180000}).click({ force: true})
        //ETAPA 5 
        cy.contains(' Siguiente ', { timeout: 180000}).click({force: true})
        cy.get('.mat-vertical-content > :nth-child(4) > .mat-primary').click({ force: true})
        cy.get('#mat-input-19', { timeout: 180000}).type('2398202', {force: true})
        cy.get('#mat-input-20', { timeout: 180000}).type('01/01/2024', {force: true})
        cy.get('#mat-input-20', { timeout: 180000}).clear({ force: true})
        cy.get('#mat-input-20', { timeout: 180000}).type('01/01/2024', {force: true})
        cy.get('#mat-input-21', { timeout: 180000}).type('02/01/2024', {force: true})
        cy.get('#mat-input-22', { timeout: 180000}).type('02/01/2025', {force: true})
        cy.get('#mat-input-22', { timeout: 180000}).clear({ force: true})
        cy.get('#mat-input-22', { timeout: 180000}).type('02/01/2025', {force: true})
        cy.get('#cdk-step-content-0-4 > .mat-vertical-content > form.ng-star-inserted > :nth-child(5) > .mat-primary').click({ force: true})
        cy.get('.modal-footer > .btn-primary', { timeout: 180000} ).click({ force: true})
      
    }

    // Igresando NIT y Tipo de propiedad en el formulario /organismosapoyo
    static Ingresando_NIT_mock(NIT_Mocking, TipoSociedadMocking) {
        const NIT = 1234
        cy.get(':nth-child(1) > :nth-child(1) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', { timeout: 180000}).click({force: true})
        cy.contains('NIT', { timeout: 180000}).click({force: true})
        cy.get('#mat-input-0', { timeout: 180000}).type(NIT)
        cy.get('.mat-select-placeholder', { timeout: 180000}).click({force: true})
        cy.contains(TipoSociedadMocking, { timeout: 180000}).click({force: true})
        cy.wait(8000)
        //Siempre le da paso la autor autenticado. 
        cy.intercept('GET', 'OARegistroCAMS/utilidades/obtenerActorAutenticadoHQ', {
            statusCode: 200,
            body: {
                "idActorAutenticado": 1127626451,
                "tipoPrestadorServicio": "ENTE ACREDITADOR",
                "razonSocial": "ORGANISMO NACIONAL DE ACREDITACIÓN DE COLOMBIA ONAC",
                "loginUsuario": "1127626451",
                "idTransaccion": "6f2e1c5e-9912-4d40-969a-5eeeacdae20e"
            }
        }).as('AutorAutenticado')
        cy.contains('Buscar').click({force: true}) 
        //ConsultarPNJ Pasa trae siempre la data de alguna empresa registrada.
        cy.intercept('GET', `OARegistroCAMS/consulta/consultarPNJ?numeroDocumento=*&tipoDocumento=N&tipoConformacion=2&tipoActor=A`, {
            statusCode: 200, // Specify the desired status code
        body:
        {
            "error": false,
            "mensaje": null,
            "identificacion": "NIT 900449241-1",
            "razonSocial": "TRANSPORTE TERRESTRE ESPECIAL NACIONAL SAS",
            "dv": "1",
            "tipoSociedad": "SOCIEDAD COMERCIAL",
            "departamento": "CAUCA",
            "municipio": "POPAYAN",
            "direccion": "CALLE 18AN NRO. 7 - 29",
            "telefono": "3218127784",
            "email": "gerencia@tentransportes.com",
            "actividadEconomica": "Transporte de pasajeros",
            "sigla": "TEN TRANSPORTES",
            "nroRegistorMercantil": "157750",
            "fechaMatricula": "04/04/2016",
            "fechaRenovacion": "31/03/2023",
            "organizacionJuridica": "SOCIEDADES POR ACCIONES SIMPLIFICADAS SAS",
            "representantesLegales": [
                {
                    "identificacion": 7185740,
                    "nombre": "MEDINA NIÑO YEFER IBAN",
                    "tipoVinculo": "Representante Legal - Principal",
                    "tipoIdentificacion": "CEDULA DE CIUDADANIA"
                },
                {
                    "identificacion": 34561623,
                    "nombre": "DE VICTORIA VELASCO SANDRA PATRICIA",
                    "tipoVinculo": "Representante Legal - Suplente",
                    "tipoIdentificacion": "CEDULA DE CIUDADANIA"
                }
            ],
            "propietarios": null,
            "establecimientos": [
                {
                    "codigoCamara": "28",
                    "nombreEstablecimiento": "TEN TRANSPORTE",
                    "fechaMatricula": "25/10/2016",
                    "fechaRenovacion": "31/03/2023",
                    "actividadEconomica": "Transporte de pasajeros",
                    "departamento": "Cauca",
                    "municipio": "POPAYAN",
                    "direccion": "CALLE 18AN NRO. 7 - 29",
                    "telefono": "3218127784",
                    "email": "gerencia@tentransportes.com",
                    "matriculaMercantil": "164291",
                    "tipoSociedad": "SOCIEDAD COMERCIAL",
                    "organizacionJuridica": "ESTABLECIMIENTOS DE COMERCIO",
                    "sigla": "TEN TRANSPORTES",
                    "direccionNomenclatura": null,
                    "codigoDivipol": "19001000",
                    "autoridadTransito": null
                }
            ],
            "establecimientoGuardado": null,
            "prestadoServicio": null,
            "pasoActual": null,
            "estado": null,
            "tipoPersona": null,
            "certificado": null,
            "idCertificado": null,
            "fechaExpedicion": null,
            "fechaVencimiento": null,
            "entidadCertificadora": null,
            "nombreRepLegal": null,
            "tipoConformacion": 2,
            "idDivipola": null,
            "recuperadoRunt": false,
            "direccionNomenclatura": null,
            "matriculaCea": null,
            "empresaOficialPublica": false,
            "empresaOficial": false,
            "esEmpresaOficialOT": false
        }
            // Optional respon
        }).as('interceptoRequestValidarRues')
        //Validando el cambio de formulario
        cy.url({ timeout: 180000}).should('include', '/panel')
    }

    static CapturarRequest(metodo, url, alias){
        cy.intercept(metodo, url, (req) => {
            req.reply((res) => {
                const statusCode = res.statusCode;
  
                expect(statusCode).to.eq(200)
              
            } )
            
        }).as(alias)
    }


    static Nueva_acreditacion(NIT) {
        cy.viewport(1325, 1068)
        cy.get(':nth-child(1) > :nth-child(1) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', {timeout: 20000}).click({force: true})
        cy.contains('NIT', {timeout: 20000}).click({force: true})
        cy.get(':nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex', {timeout: 20000}).type(NIT)
        cy.get('.col-sm-12 > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', {timeout: 20000}).click({force: true})
        cy.contains('Privado', {timeout: 20000}).click({force: true})
        cy.contains('Buscar', {timeout: 20000}).click({force: true})
        cy.contains(' Salir ').should('exist')
        cy.contains(' Nueva acreditación ').should('exist')
    }

    static Etapas(OA,MatMercantil) {
        cy.viewport(1325, 1068)
        cy.contains('Nueva acreditación', {timeout: 20000}).click({force: true})
        cy.get('#cdk-step-content-0-0 > .mat-vertical-content > form.ng-pristine > :nth-child(2) > :nth-child(1) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', {timeout: 20000}).click({force: true})
        cy.contains(OA, {timeout: 20000}).click({force: true})
        cy.get('#cdk-step-content-0-0 > .mat-vertical-content > form.ng-invalid > :nth-child(2) > :nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', {timeout: 20000}).click({force: true})
        cy.contains('PERSONA JURÍDICA', {timeout: 20000}).click({force: true})
        cy.contains('Siguiente', {timeout: 20000}).click({force: true})
        cy.intercept('POST', 'OARegistroCAMS/solicitud/actualizarSolicitud', {
            statusCode: 200, // Specify the desired status code
            body:
                {
                    "error": false,
                    "mensaje": "Se actualizo la solicitud correctamente",
                    "codigo": null,
                    "idSolicitud": 1385,
                    "idCupl": null,
                    "pdf": null
                }  // Optional response body
        }).as('ActualizarSolicitud')
        cy.get('.mat-drawer-content').scrollTo('bottom')
        cy.contains(' Siguiente ', {timeout: 20000}).click({force: true})
        cy.get(':nth-child(2) > .col-4 > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', {timeout: 20000}).type(MatMercantil)
        cy.contains('Buscar', {timeout: 20000}).click({force: true})
        cy.contains('Editar', {timeout: 20000}).click({force: true})
        cy.get(':nth-child(1) > .form-control', {timeout: 20000}).select('CARRERA')
        cy.get(':nth-child(3) > .form-control', {timeout: 20000}).type('70')
        cy.get(':nth-child(6) > .form-control', {timeout: 20000}).type('80')
        cy.get(':nth-child(8) > .form-control', {timeout: 20000}).type('25')
        cy.contains('Generar Dirección', {timeout: 20000}).click({force: true})
        cy.contains('Siguiente', {timeout: 20000}).click({force: true})
        cy.wait(10000)
        cy.contains('Siguiente', {timeout: 20000}).click({force: true})
        cy.wait(5000)
        cy.get('#mat-input-19', {timeout: 20000}).type('Prueba20135', {force: true})
        cy.get('#mat-input-20', {timeout: 20000}).type('16/01/2024', {force: true})
        cy.get('#mat-input-21', {timeout: 20000}).type('16/01/2024', {force: true})
        cy.get('#mat-input-22', {timeout: 20000}).type('16/01/2029', {force: true})
        cy.contains('Anterior', {timeout: 20000}).should('exist')
        cy.contains('Guardar', {timeout: 20000}).should('exist').click({force: true})
        cy.contains('Aceptar', {timeout: 20000}).click()
    }

    static validar_Login(){
        cy.clearCookies();  
        const username = Cypress.env('USER_RUNTPRO')
        const password = Cypress.env('PASSWORD_RUNTPRO')
        cy.viewport(1325, 1068)
        cy.visit('https://azspkdevstcus004.z19.web.core.windows.net/#/', {timeout: 180000})
        cy.get('#continue', {timeout: 180000}).click()    
        cy.get('#password').invoke('val', password)
        cy.get('#signInName').invoke('val', username)

       cy.intercept('POST', '/RNFShellMS/validarSession', {
        statusCode: 200, // Specify the desired status code
        body:
            {
                "contenido": "Error",
                "error": true,
                "codigoResultado": "OK",
                "descripcionRespuesta": "El usuario ya ha alcanzado el número máximo permitido de sesiones. Cierre una de las sesiones existentes antes de intentar iniciar sesión nuevamente."
            }  // Optional response body
      }).as('interceptoRequestValidarSession')
        cy.get('#next', {timeout: 180000}).click() 
      
       

        ValidacionesApi.CapturarRequest('GET', '/RNFShellMS/menu', 'intercepto request menu')
        ValidacionesApi.CapturarRequest('GET', '/RNFShellMS/informacionUsuario', 'intercepto request informacionUsuario', )
        ValidacionesApi.CapturarRequest('GET', 'RNFShellMS/VersionProyecto', 'intercepto request VersionProyecto')
        ValidacionesApi.CapturarRequest('POST', '/RNFShellMS/ValidarOrganismo/validarEstado', 'intercepto request validarEstado')
       // ValidacionesApi.CapturarRequest('GET', '/RNFConsultaParametricasMS/parametricas/obtenerValorParametrica?clave=ACTIVAR_VALIDACION_HUELLA', 'intercepto request obtenerValorParametrica?clave=ACTIVAR_VALIDACION_HUELLA')
       ValidacionesApi.CapturarRequest('GET', '/RNFShellMS/informacionUsuario/tipoEntidad', 'intercepto request_informacionUsuario/tipoEntidad')
       
        cy.reload()
        cy.get('#continue', {timeout: 180000}).click()    
        cy.get('#password').invoke('val', password)
        cy.get('#signInName').invoke('val', username)
        cy.get('#next', {timeout: 180000}).click() 
  
        
        cy.wait('@interceptoRequestValidarSession', {timeout: 180000}).then((interception) => {
            const responseBody = interception.response.body;

            if (responseBody.descripcionRespuesta === 'OK') {
            // Lógica para una respuesta 'OK'
                cy.log('no se detecto ningun alert')
            } else {
                cy.get('.swal2-cancel',  {timeout: 110000}).click()
            // Lógica para otras respuestas
            }
       })
        cy.get('#exitTour', {timeout: 180000}).click()
        cy.url().should('eq', 'https://azspkdevstcus004.z19.web.core.windows.net/#/home')
    } 

    static validar_status_code(response, status_code, mensaje) {
        expect(response.status, `${mensaje}`).to.eq(status_code)
    }

    static validar_contenido_atributo(objeto, atributo, valor, mensaje) {
        expect(objeto[`${atributo}`], `${mensaje}`).to.eq(valor)
    }

    static validar_respuesta_body(response, valor) {
        expect(response.body, 'La respuesta obtenida es la correcta').to.eq(valor)
    }
    
    static comprobar_extension_archivo(ruta_archivo, extensiones_permitidas, mensaje) {
        const extension_archivo = (ruta_archivo.substring(ruta_archivo.lastIndexOf("."))).toLowerCase();
        let permitida = false;
        for (let i = 0; i < extensiones_permitidas.length; i++) {
            if (extensiones_permitidas[i] === extension_archivo) {
                permitida = true;
                break;
            }
        }
        expect(permitida, `${mensaje}`).to.eq(true)
    }

    static validacion_datos_basicos_portalOA(tipo_prestador){
        let solicitudNumDocumento;
        let solicitudPersonaDocumento;

        it('Ingreso a la página', () => {
            cy.task('ejecutar_query_oracle', {
                statement: `SELECT SOL.SOLICITUD_TIPO_DOCUMENTO,
                           SOL.SOLICITUD_NUM_DOCUMENTO,
                           PER.PERSONA_NRODOCUME,
                           PER2.PERSONA_TIPOIDENT_IDTIPDOC,
                           PER2.PERSONA_NRODOCUME
                    FROM RUNTPROD.TR_REPRLEGAL RL
                             INNER JOIN RUNTPROD.GE_EMPRESA EMP ON
                        (EMP.EMPRESA_PERSONA_IDPERSONA = RL.REPRLEGAL_EMPRESA_IDPERSONA)
                             INNER JOIN RUNTPROD.TR_PERSONA PER ON
                        (PER.PERSONA_IDPERSONA = EMP.EMPRESA_PERSONA_IDPERSONA)
                             INNER JOIN RUNTPROD.TR_PERSNATUR PN ON
                        (RL.REPRLEGAL_PERSONA_IDEREPPER = PN.PERSNATUR_PERSONA_IDPERSONA)
                             INNER JOIN RUNTPROD.TR_PERSONA PER2 ON
                        (PER2.PERSONA_IDPERSONA = PN.PERSNATUR_PERSONA_IDPERSONA)
                             INNER JOIN CSWHABILITACIONPNJ.RP_SOLICITUD SOL ON
                        (SOL.SOLICITUD_NUM_DOCUMENTO = PER.PERSONA_NRODOCUME)
                             INNER JOIN RUNTPROD.PA_TIPPRESER TPS ON
                        (SOL.FK_TIPOPRESTADOR_ID = TPS.TIPPRESER_CODTIPSER)
                      WHERE 
                          PER.PERSONA_ESTAPERSO_NOMBRE = 'ACTIVA'
                          AND RL.REPRLEGAL_ESTADO_NOMBRE = 'ACTIVO'
                          AND EMP.EMPRESA_ESTAEMPRE_NOMBRE = 'ACTIVO'
                          AND PER.PERSONA_TIPOIDENT_IDTIPDOC = 'N'
                          AND TPS.TIPPRESER_NOMBRE = '${tipo_prestador}'
                          AND SOL.SOLICITUD_ESTADO = 'APROBADA'
                          AND EMP.EMPRESA_MATRMERCA <> 0
                          AND TO_DATE(CERACRE_FEC_INI_VIGENCIA,'dd/mm/yyyy') <= SYSDATE
                          AND TO_DATE(CERACRE_FEC_FIN_VIGENCIA,'dd/mm/yyyy') >= SYSDATE`
            }).then(response => {

                solicitudNumDocumento = response.rows[0].SOLICITUD_NUM_DOCUMENTO;
                solicitudPersonaDocumento = response.rows[0].PERSONA_NRODOCUME_1;
            });
            cy.visit('https://azspkdevstcus015.z19.web.core.windows.net/organismosdeapoyo/oa-portal-organismos-mr')
            cy.wait(5000)
        });
        it('Ingreso de Información', () => {
            cy.log(`El número aleatorio es: ${solicitudNumDocumento}`)
            cy.log(`El número de persona es: ${solicitudPersonaDocumento}`)
            cy.get('[formcontrolname="repTipoDoc"]').select('Cédula Ciudadanía')
            cy.get('[formcontrolname="repDoc"]').type(`${solicitudPersonaDocumento}`)
            cy.get('[formcontrolname="tipoDocumento"]').select('NIT');
            cy.get('[formcontrolname="documento"]').type(`${solicitudNumDocumento}`)
            cy.get('[formcontrolname="tipoPrestadorServicio"]').select(`${tipo_prestador}`)
            cy.get('span.mat-checkbox-inner-container').click()
            cy.get('div.form-footer').click()
            cy.get('span').contains('Siguiente').click()
        })
    }
    static validar_correo_portalOA (){
        it('Confirmación Email', () => {
            //cy.get('span.mat-radio-outer-circle', {timeout:20000}).first().click({force:true})
            cy.contains('label', '.com').click();
            //cy.get('span.mat-radio-outer-circle').click()
            cy.get('span').contains('Siguiente').click()
            cy.wait(5000)
        })
    }

    static validar_codigo_OTP_portalOA(){

        let codigoEmail;
        it("Extraer Código OTP",() => {
            cy.task('ejecutar_query_oracle', {
                statement: `select * from CSWHABILITACIONPNJ.RP_OTP order by OTP_FECHA_CREACION desc`
            }).then(response => {
                codigoEmail = response.rows[0].OTP_CODIGO_OTP;
            });
        });

        it('Ingreso Código', () => {
            cy.get('[formcontrolname="codigo1"]').type(`${codigoEmail.toString()[0]}`)
            cy.get('[formcontrolname="codigo2"]').type(`${codigoEmail.toString()[1]}`)
            cy.get('[formcontrolname="codigo3"]').type(`${codigoEmail.toString()[2]}`)
            cy.get('[formcontrolname="codigo4"]').type(`${codigoEmail.toString()[3]}`)
            cy.get('[formcontrolname="codigo5"]').type(`${codigoEmail.toString()[4]}`)
            cy.get('[formcontrolname="codigo6"]').type(`${codigoEmail.toString()[5]}`)
        });
    }
    static visualizar_informacion_basica_portalOA(opcion){
        it('Información básica del registro', () => {
            cy.get('span').contains('Siguiente').click()
            cy.get('.mat-row > .cdk-column-Estado', {timeout:10000}).first().click({force:true})
            cy.get('span').contains(opcion).click()
        });
    }

    static validar_notificacion_oa(notificacion_codigo, id_notificacion, notificacion) {
        let cantidad_de_registros;
        const valida_servicio = `SELECT *
                                 FROM CSWHABILITACIONPNJ.PA_NOTIFICACIONES
                                 WHERE NOTIFICACION_CODIGO = '${notificacion_codigo}'`;

        ApiGmail.vaciar_buzon()

        describe(`${notificacion}`, () => {
            it(`Consultar los registros del log en la base de datos antes de consumir el servicio`, () => {
                cy.task('ejecutar_query_oracle', {
                    statement: `SELECT *
                                FROM CSWHABILITACIONPNJ.RP_NOTIFICACION_CRON_NOVEDAD
                                WHERE PANOTIFICA_ID = ${id_notificacion}
                                  AND TRUNC(FECHA_EJECUCION) = TO_DATE(sysdate, 'DD/MM/YY')
                                ORDER BY FECHA_EJECUCION DESC`
                }).then(response => {
                    cantidad_de_registros = response.rows.length
                })
            })

            it('Validar que la notificación se encuentre en estado ACTIVO', () => {
                cy.task('ejecutar_query_oracle', {
                    statement: valida_servicio,
                }).then((response) => {
                    const NOTIFICACION_ACTIVO = (response.rows[0]['NOTIFICACION_ESTADO'])
                    expect(NOTIFICACION_ACTIVO).to.eq('ACTIVO', 'EL parámetro esta activo, se pueden ejecutar las pruebas.')
                });
            });

            it('Validar que se realice el consumo del servicio de la notificación correctamente', () => {
                cy.request({
                    method: 'GET',
                    url: `https://az-hub-dev-apim-dev-cus-000.azure-api.net/OANotificacionesMS/notificaciones/procesarNotificacionCron?codigo=${notificacion_codigo}`,
                }).then((response) => {
                    ValidacionesApi.validar_status_code(response, 200, 'Consumo del servicio exitoso')
                    ValidacionesApi.validar_respuesta_body(response, 'Notificacion procesada')
                })
            });

            it('Validar que se registre en base de datos correctamente el log correspondiente', () => {
                cy.task('ejecutar_query_oracle', {
                    statement: `SELECT *
                                FROM CSWHABILITACIONPNJ.RP_NOTIFICACION_CRON_NOVEDAD
                                WHERE PANOTIFICA_ID = ${id_notificacion}
                                  AND TRUNC(FECHA_EJECUCION) = TO_DATE(sysdate, 'DD/MM/YY')
                                ORDER BY FECHA_EJECUCION DESC`
                }).then(response => {
                    expect(response.rows.length).to.eq(cantidad_de_registros + 1, `Se registró correctamente el log en la base de datos correspondiente a la notificación ${notificacion}`)
                })
                cy.wait(10000)
            });
        })
    }
}