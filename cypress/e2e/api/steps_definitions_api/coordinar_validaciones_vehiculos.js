import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { CoordinarValidacionesVehiculosPage } from "../../../pages/CoordinarValidacionesVehiculosPage";

Given("Las validaciones del los vehiculos están encendidas", () => {
    CoordinarValidacionesVehiculosPage.habilitarParametros();
});

Given("Se tiene el número de placa del vehiculo a consultar", () => {
    CoordinarValidacionesVehiculosPage.consultarPlacaBaseDeDatos();
});

When("Se ejecuta el servicio coordinar validaciones vehiculo con el numero de placa", () => {
    CoordinarValidacionesVehiculosPage.consumirServicioCoordinarValidacionesVehiculos();
});

Then("El codigo de estado debe ser 200", () => {
    CoordinarValidacionesVehiculosPage.validarStatusCode();
});

Then("La respuesta debe contener 6 registros, los cuales corresponden a las validaciones realizadas", () => {
    CoordinarValidacionesVehiculosPage.validarCantidadRegistrosResponse(6);
});

Then("El esquema de la respuesta el servicio es el correcto", () => {
    CoordinarValidacionesVehiculosPage.ValidarSchemaRespuesta();
});

Given("Las validaciones del los vehiculos están apagadas", () => {
    CoordinarValidacionesVehiculosPage.deshabilitarParametros()
});

Then("La respuesta debe contener 0 registros", () => {
    CoordinarValidacionesVehiculosPage.validarCantidadRegistrosResponse(0);
    CoordinarValidacionesVehiculosPage.habilitarParametros();
    CoordinarValidacionesVehiculosPage.runScriptFirma();
});