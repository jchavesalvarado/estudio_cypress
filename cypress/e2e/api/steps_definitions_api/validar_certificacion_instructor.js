import {
    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { ValidarCertificacionInstructor } from "../../../pages/ValidarCertificacionInstructorPage";


Given("Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt con una certificación en estdo activo y vigente", () => {
    ValidarCertificacionInstructor.consultarInstructorConCertificacion();
});

When("Se ejecuta el servicio validar certificación instructor con el tipo de documento y número de documento", () => {
    ValidarCertificacionInstructor.consumirServicioValidarInstructor();
});

Then("El codigo de estado del servicio consumido debe ser igual a 200", () => {
    ValidarCertificacionInstructor.validarStatusCode();
});

Then("El mensaje de la causal de rechazo del servicio consumido debe ser igual a null", () => {
    ValidarCertificacionInstructor.validarMensajeCertificacionActivaVigente();
});

Then("El esquema de la respuesta el servicio consumido debe ser el correcto", () => {
    ValidarCertificacionInstructor.validarSchemaRespuesta();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Given("Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación asociada", () => {
    ValidarCertificacionInstructor.consultarInstructorSinCertificacion();
});

Then("El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación asociada", () => {
    ValidarCertificacionInstructor.validarMensajeInstructorSinCertificacion();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Given("Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación en estado activo", () => {
    ValidarCertificacionInstructor.consultarInstructorConCertificacionNoActiva();
});

Then("El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación en estado activo", () => {
    ValidarCertificacionInstructor.validarMensajeInstructorConCertificacionNoActiva();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Given("Que se tiene el tipo de documento y numero de documento de un instructor registrado y activo en el Runt sin una certificación vigente", () => {
    ValidarCertificacionInstructor.consultarInstructorConCertificacionVencida();
});

Then("El mensaje de la causal de rechazo del servicio: El instructor no cuenta con una certificación vigente", () => {
    ValidarCertificacionInstructor.validarMensajeInstructorConCertificacionVencida();
});
