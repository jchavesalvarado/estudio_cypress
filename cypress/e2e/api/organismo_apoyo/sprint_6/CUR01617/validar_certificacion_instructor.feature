Feature: CURO1617 Validar Certificación de Instructor

    Este caso de uso permite validar que la certificación de instructor se encuentre registrada en estado Activo y Vigente

    Scenario: EP1_CUR01617_OA: Validar que la certificación de instructor se encuentre registrada en estado Activo y Vigente
        Given Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt con una certificación en estdo activo y vigente
        And   Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros antes de consumir el servicio validar certificación
        When  Se ejecuta el servicio validar certificación instructor con el tipo de documento y número de documento
        Then  El codigo de estado del servicio consumido debe ser igual a 200
        And El mensaje de la causal de rechazo del servicio consumido debe ser igual a null
        And El esquema de la respuesta el servicio consumido debe ser el correcto
        And Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros al consumir el servicio validar certificación
        And Se debe registrar correctamente el log del caso de uso en la base de datos al ejecutar el caso de uso
    
    Scenario: EP2_CUR01617_OA: Validar cuando no se encuentra registrada una certificación de instructor
        Given Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación asociada
        And   Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros antes de consumir el servicio validar certificación
        When  Se ejecuta el servicio validar certificación instructor con el tipo de documento y número de documento
        Then  El codigo de estado del servicio consumido debe ser igual a 200
        And El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación asociada
        And El esquema de la respuesta el servicio consumido debe ser el correcto
        And Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros al consumir el servicio validar certificación
        And Se debe registrar correctamente el log del caso de uso en la base de datos al ejecutar el caso de uso

    Scenario: EP3_CUR01617_OA: Validar cuando la certificación de instructor no se encuentra en estado activo
        Given Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación en estado activo
        And   Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros antes de consumir el servicio validar certificación
        When  Se ejecuta el servicio validar certificación instructor con el tipo de documento y número de documento
        Then  El codigo de estado del servicio consumido debe ser igual a 200
        And El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación en estado activo
        And El esquema de la respuesta el servicio consumido debe ser el correcto
        And Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros al consumir el servicio validar certificación
        And Se debe registrar correctamente el log del caso de uso en la base de datos al ejecutar el caso de uso
    
    Scenario: EP4_CUR01617_OA: Validar cuando la certificación de instructor no se encuentra Vigente
        Given Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación vigente
        And   Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros antes de consumir el servicio validar certificación
        When  Se ejecuta el servicio validar certificación instructor con el tipo de documento y número de documento
        Then  El codigo de estado del servicio consumido debe ser igual a 200
        And El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación vigente
        And El esquema de la respuesta el servicio consumido debe ser el correcto
        And Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros al consumir el servicio validar certificación
        And Se debe registrar correctamente el log del caso de uso en la base de datos al ejecutar el caso de uso