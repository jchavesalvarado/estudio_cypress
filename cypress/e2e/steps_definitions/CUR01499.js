import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { PageCUR01499 } from "../pages/PageCUR01499";

Given("Las validaciones del los vehiculos están encendidas", () => {
    PageCUR01499.habilitarParametros();
});

Given("Se tiene el número de placa del vehiculo a consultar", () => {
    PageCUR01499.consultarPlacaBaseDeDatos();
});

When("Se ejecuta el servicio coordinar validaciones vehiculo con el numero de placa", () => {
    PageCUR01499.consumirServicioCoordinarValidacionesVehiculos();
});

Then("El codigo de estado debe ser 200", () => {
    PageCUR01499.validarStatusCode();
});

Then("La respuesta debe contener 6 registros, los cuales corresponden a las validaciones realizadas", () => {
    PageCUR01499.validarCantidadRegistrosResponse(7);
});

Then("El esquema de la respuesta el servicio es el correcto", () => {
    PageCUR01499.ValidarSchemaRespuesta();
});

Given("Las validaciones del los vehiculos están apagadas", () => {
    PageCUR01499.deshabilitarParametros()
});

Then("La respuesta debe contener 0 registros", () => {
    PageCUR01499.validarCantidadRegistrosResponse(0);
    PageCUR01499.habilitarParametros();
});