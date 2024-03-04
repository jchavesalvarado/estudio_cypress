import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { CUR01499_Page } from "../pages/CUR01499_Page";

Given("Las validaciones del los vehiculos están encendidas", () => {
    CUR01499_Page.habilitarParametros();
});

Given("Se tiene el número de placa del vehiculo a consultar", () => {
    CUR01499_Page.consultarPlacaBaseDeDatos();
});

When("Se ejecuta el servicio coordinar validaciones vehiculo con el numero de placa", () => {
    CUR01499_Page.consumirServicioCoordinarValidacionesVehiculos();
});

Then("El codigo de estado debe ser 200", () => {
    CUR01499_Page.validarStatusCode();
});

Then("La respuesta debe contener 6 registros, los cuales corresponden a las validaciones realizadas", () => {
    CUR01499_Page.validarCantidadRegistrosResponse(7);
});

Then("El esquema de la respuesta el servicio es el correcto", () => {
    CUR01499_Page.ValidarSchemaRespuesta();
});

Given("Las validaciones del los vehiculos están apagadas", () => {
    CUR01499_Page.deshabilitarParametros()
});

Then("La respuesta debe contener 0 registros", () => {
    CUR01499_Page.validarCantidadRegistrosResponse(0);
    CUR01499_Page.habilitarParametros();
});