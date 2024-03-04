Feature: CURO1513 Validar Color CEA
 
    Este caso se encarga de validar que el servicio 1513 encargado de validar el color de los vehiculos para CEA funcione correctamente al ejecutarse el servicio queda un segistro en una tabla en este caso validamos la correcta ejecucion del servicio y su correcto registro.
 
    #Este caso hace referemncia al caso de prueba 1 donde comprobaremos que un vehiculo para un OA de tipo CEA cumpla con los colores establecidos en la parametrizacion.
   
    @EscenarioDePrueba1
    Scenario: EP1_CC0001_RNPNJ: El vehiculo cumple con el color
        Given Capturo datos de la tabla log
        And   Y capturo data de la placa para el servicio
        When  Ejecuto el servicio y valido su respuesta.
        Then  Valido la informacion del log luego de la ejecucion del servicio.
 
      #Este caso hace referemncia al caso de prueba 2 donde comprobaremos que un vehiculo para un OA de tipo CEA no cumpla con los colores establecidos en la parametrizacion.
 
    @EscenarioDePrueba2
    Scenario: EP2_CC0001_RNPNJ: El vehiculo no cumple con el color
        Given Actualizo la placa para que no cumpla validaciones
        And   Y capturo data de la placa para el servicio
        When  Ejecuto el servicio y valido su respuesta.
        Then  Valido la informacion del log luego de la ejecucion del servicio para este caso.