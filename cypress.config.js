const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { cargar_plugin_oracle } = require("./cypress/database/oracle_runt");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
require('dotenv').config()
const fs = require('fs');

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
    // Plugin reportes Cypress
    allureWriter(on, config);
    on('after:run', (results) => {
        const data = `Environment=${process.env.ENVIRONMENT}\nBrowser=${results.browserName}\nBrowserVersion=${results.browserVersion}`
        fs.writeFile('allure-results/environment.properties', data, (err) => {
          if (err) throw err;
        });
      });
    // Plugin task base de datos oracle
    on('task', cargar_plugin_oracle(config));
    // Retornando la configuración.
    return config;
}

module.exports = defineConfig({
    e2e: {
        setupNodeEvents,
        specPattern: "cypress/e2e/**/*.feature",
        chromeWebSecurity: false,
        fixturesFolder: "cypress/fixtures",
        taskTimeout: 1800000,

        allureReuseAfterSpec: true,
        allure: true
    },
    env: {
        DB_USER_DESARUNT: process.env.USER_DESARUNT,
        DB_PASSWORD_DESARUNT: process.env.PASSWORD_DESARUNT,
        DB_CONNECTSTRING_DESARUNT: process.env.CONNECTSTRING_DESARUNT,
        GRANT_TYPE: process.env.GRANT_TYPE,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN,
        USER_ID: process.env.USER_ID,
        USER_RUNTPRO: process.env.USER_RUNTPRO,
        PASSWORD_RUNTPRO: process.env.PASSWORD_RUNTPRO,
        SCOPE_RUNTPRO: process.env.SCOPE_RUNTPRO,
        CLIENT_ID_RUNTPRO: process.env.CLIENT_ID_RUNTPRO,
        TOKEN_AUDIENCE: process.env.TOKEN_AUDIENCE,
        EXECUTABLE_PATH: process.env.EXECUTABLE_PATH_FIRMA
      }
});