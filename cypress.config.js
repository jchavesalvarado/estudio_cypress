const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

// Configuración de los plugins
async function setupNodeEvents(on, config) {
    // Esto es necesario para que el preprocesador pueda generar informes JSON después de cada ejecución, y más.
    await preprocessor.addCucumberPreprocessorPlugin(on, config);
    on(
        "file:preprocessor",
        createBundler({
            plugins: [createEsbuildPlugin.default(config)],
        })
    );
    // Retornando la configuración.
    return config;
}

module.exports = defineConfig({
    e2e: {
        setupNodeEvents,
        specPattern: "cypress/e2e/**/*.feature",
        baseUrl: "https://www.saucedemo.com",
        chromeWebSecurity: false,
    },
});