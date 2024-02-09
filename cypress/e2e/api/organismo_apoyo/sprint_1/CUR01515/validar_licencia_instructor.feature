Feature: CURO1515 Validar Licencia de Conducción Instructor

    Este caso de uso permite validar que la licencia de conduccion de un instructor se encuentre Vigente, en estado Activo y que corresponda a las categorías seleccionadas al instructor para impartir enseñanza.

    Scenario: EP1_CUR01515_OA: Licencia de conducción activa y vigente
        Given Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion de un instructor en estado activo y vigente
        When  Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y categoría de la licencia de conduccion
        Then  El codigo de estado debe ser igual a 200
        And El mensaje de la causal de rechazo debe ser null
        And El esquema de la respuesta el servicio debe ser el correcto

    Scenario: EP2_CUR01515_OA: Intructor sin licencia de conducción
        Given Que se tiene el tipo de documento y numero de documento de un instructor que no tiene licencia
        When  Se ejecuta el servicio validar licencia conduccion con el tipo de documento y número de documento
        Then  El codigo de estado debe ser igual a 200
        And El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente
        And El esquema de la respuesta el servicio debe ser el correcto
    
    Scenario: EP3_CUR01515_OA: Intructor con licencia de conducción en un estado diferente a activo
        Given Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion de un instructor en estado diferente a activo
        When  Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y categoría de la licencia de conduccion
        Then  El codigo de estado debe ser igual a 200
        And El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al estado no activo
        And El esquema de la respuesta el servicio debe ser el correcto

    Scenario: EP4_CUR01515_OA: Intructor con licencia de conducción no vigente
        Given Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion que este vigente
        When  Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y categoría de la licencia de conduccion
        Then  El codigo de estado debe ser igual a 200
        And El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al no estar vigente
        And El esquema de la respuesta el servicio debe ser el correcto

    Scenario: EP5_CUR01515_OA: Las categorías de la licencia no corresponde con las asignadas por el CEA
        Given Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion de un instructor en estado activo y vigente
        When  Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y una categoría de conducción que no corresponda con con la asignada por el CEA
        Then  El codigo de estado debe ser igual a 200
        And El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al no coincidir las categorias
        And El esquema de la respuesta el servicio debe ser el correcto