import {
    Given,
    When,
    Then
} from "@badeball/cypress-cucumber-preprocessor";
import ClasesContratoSICOV from "../pages/CUR01639_Page";
 
Given('Ingreso a la pagina de RUNT', () => {
    ClasesContratoSICOV.validar_Login_2()
})

Given('Capturo informacion de el numero de registros SICOV', () => {
    ClasesContratoSICOV.Capturo_Num_SICOV()
})

Given('Me dirijo al formulario para crear un registro SICOV', () => {
    ClasesContratoSICOV.Steps_Formulario_SICOV()
})

Given('Obtengo la informacion de la persona juridica que voy a buscar', () => {
    ClasesContratoSICOV.ObtenerDataPersonaJurifica()
})

When('lleno todos los campos del registro SICOV', () => {
    ClasesContratoSICOV.Llenado_de_campos()
})

Then('Valido que exista el boton de guardar', () => {
    ClasesContratoSICOV.Valido_button_guardar()
})