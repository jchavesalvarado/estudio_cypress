
import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { ValidarLicenciaInstructor } from "../pages/CUR01515_Page";

Given("Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion de un instructor en estado activo y vigente", () => {
    ValidarLicenciaInstructor.consultarIntructorConLicenciaConduccion();
});

Given("Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros antes de consumir el servicio", () => {
    ValidarLicenciaInstructor.consultarCantidadInicialDeRegistrosTablaLog();
});

When("Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y categoría de la licencia de conduccion", () => {
    ValidarLicenciaInstructor.consumirServicioValidarIntructor();
});

Then("El codigo de estado debe ser igual a 200", () => {
    ValidarLicenciaInstructor.validarStatusCode();
});

Then("El mensaje de la causal de rechazo debe ser null", () => {
    ValidarLicenciaInstructor.validarMensajeExitoso();
});

Then("El esquema de la respuesta el servicio debe ser el correcto", () => {
    ValidarLicenciaInstructor.ValidarSchemaRespuesta();
});

Then("Se revisa la tabla de donde se guarda el log para mirar la cantidad de registros al consumir el servicio", () => {
    ValidarLicenciaInstructor.consultarCantidadFinalDeRegistrosTablaLog();
});

Then("Se debe registrar correctamente el log del caso de uso en la base de datos", () => {
    ValidarLicenciaInstructor.validarRegistroLogEnLaBaseDeDatos();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Given("Que se tiene el tipo de documento y numero de documento de un instructor que no tiene licencia", () => {
    ValidarLicenciaInstructor.consultarIntructorSinLicenciaConduccion();
});

When("Se ejecuta el servicio validar licencia conduccion con el tipo de documento y número de documento", () => {
    ValidarLicenciaInstructor.consumirServicioValidarIntructor();
});

Then("El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente", () => {
    ValidarLicenciaInstructor.valdiarMensajeSinLicencia();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Given("Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion de un instructor en estado diferente a activo", () => {
    ValidarLicenciaInstructor.consultarIntructorConLicenciaConduccionNoActiva();
});

Then("El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al estado no activo", () => {
    ValidarLicenciaInstructor.validarMesajeLicenciaNoActiva();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Given("Que se tiene el tipo de documento, numero de documento y categoría de la licencia de conduccion que este vigente", () => {
    ValidarLicenciaInstructor.consultarIntructorConLicenciaConduccionVencida();
});

Then("El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al no estar vigente", () => {
    ValidarLicenciaInstructor.validarMesajeLicenciaVencida();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
When("Se ejecuta el servicio validar licencia conduccion con el tipo de documento, número de documento y una categoría de conducción que no corresponda con con la asignada por el CEA", () => {
    ValidarLicenciaInstructor.consumirServicioValidarInstructorCategorias();
});

Then("El mensaje de la causal de rechazo debe ser diferente de null y debe ser el correspondiente al no coincidir las categorias", () => {
    ValidarLicenciaInstructor.validarMesajeCategorias();
});