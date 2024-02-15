Scenario: CUR01639 Registrar contrato del SICOV - Agregar contrato SICOV.

    Este caso se encarga de guardar un registro SICOV para los diferentes organismos de apoyo disponibles, a estos organismos de apoyo se les pueden crear contratos SICOV donde se solicitan unos datos especificos del OA y se valida que este apto para crear dicho contatro. 

    #Validar que el sistema permita registrar la información del contrato suscrito con un CDA para el uso del SICOV de acuerdo con la entidad a la que pertenece el usuario que se encuentra autenticado en el sistema,  el sistema consulta y filtra de acuerdo con la información ingresada, verifica que los datos de entrada cumplen con la obligatoriedad y restricciones descrita, además validar que el archivo cargado sea tipo PDF, En caso contrario Validar que el sistema identifica cuando el actor al dar clic en el botón "Limpiar" el sistema limpiar la información de las entradas y retorna al estado predeterminado las entradas. (Ver F.A 5.1)  el sistema despliega los campos de la tabla correctamente, una vez realizadas las validaciones anteriores el sistema registra el log de auditoría y trazabilidad de usuario, envía la información correspondiente de las entradas del caso de uso, la acción y la descripción realizadas. (Ver Flujo básico de eventos).

    @EscenarioDePrueba1
    Scenario: EP1_CUR01639_OA
        Given Ingreso a la pagina de RUNT