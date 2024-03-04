import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import pruebas from "../pages/CUR01513_Page"
 
Given("Capturo datos de la tabla log", () => {
    pruebas.ObtenerDataLog()
})
 
Given("Y capturo data de la placa para el servicio", () => {
    pruebas.ObtenerDataPlaca()
})
 
When("Ejecuto el servicio y valido su respuesta.", () => {
    pruebas.EjecutarServicio()
})

 
Then("Valido la informacion del log luego de la ejecucion del servicio.", () => {
    pruebas.CompararDataLog()
    })
 
Given('Actualizo la placa para que no cumpla validaciones', () => {
    pruebas.ActualizandoData()
 
Given("Y capturo data de la placa para el servicio", () => {
    pruebas.ObtenerDataPlaca()
})
 
When("Ejecuto el servicio y valido su respuesta.", () => {
    pruebas.EjecutarServicio1()
})})
 
Then("Valido la informacion del log luego de la ejecucion del servicio para este caso.", () => {
    pruebas.CompararDataLog2()
    })
 
