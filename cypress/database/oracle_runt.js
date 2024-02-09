let conexion;

const PluginOracleDatabase = {

    async configurar_conexion(config) {
        const oracledb = require('oracledb');
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        oracledb.autoCommit = true;
        oracledb.initOracleClient({libDir:'C:\\instantclient_21_12'})
        conexion = await oracledb.getConnection({
            user: config.env['DB_USER_DESARUNT'],
            password: config.env['DB_PASSWORD_DESARUNT'],
            connectString: config.env['DB_CONNECTSTRING_DESARUNT'],
        });

        return null;
    },

    async test_conexion(config) {
        if (!conexion) {
            await this.configurar_conexion(config);
        }
    },

    async ejecutar_query(statement, config) {
        await this.test_conexion(config);

        try {
            return await conexion.execute(statement);
        } catch (e) {
            throw new Error('Falló la ejecución: ' + statement + '\n' + e.message);
        }
    },
}

Object.freeze(PluginOracleDatabase);

function cargar_plugin_oracle(config) {
    return {
        async ejecutar_query_oracle({statement}) {
          return await PluginOracleDatabase.ejecutar_query(statement, config);
        },
    }
}

module.exports = {
    cargar_plugin_oracle: cargar_plugin_oracle
}