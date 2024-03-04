Feature: CURO1499 Coordinar Validaciones Vehiculos

    Este caso de uso permite coordinar la ejecucion de las validaciones para los vehiculos a agregar a un organismo de apoyo.

    Scenario: EP1_CUR01499_OA: Validaciones de los vehiculos encendidas
        Given Las validaciones del los vehiculos están encendidas
        And Se tiene el número de placa del vehiculo a consultar
        When  Se ejecuta el servicio coordinar validaciones vehiculo con el numero de placa
        Then  El codigo de estado debe ser 200
        And La respuesta debe contener 6 registros, los cuales corresponden a las validaciones realizadas
        And El esquema de la respuesta el servicio es el correcto
    
    Scenario: EP2_CUR01499_OA: Validaciones de los vehiculos apagadas
        Given Las validaciones del los vehiculos están apagadas
        And Se tiene el número de placa del vehiculo a consultar
        When  Se ejecuta el servicio coordinar validaciones vehiculo con el numero de placa
        Then  El codigo de estado debe ser 200
        And La respuesta debe contener 0 registros
        And El esquema de la respuesta el servicio es el correcto