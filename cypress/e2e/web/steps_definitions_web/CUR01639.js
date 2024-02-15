import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import ClasesContratoSICOV from "../../../pages/CUR01639POM";
 
Given('Ingreso a la pagina de RUNT', () => {
    ClasesContratoSICOV.validar_Login_2()
})