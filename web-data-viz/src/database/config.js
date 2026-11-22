//configuração da conexão com o banco de dados

var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function verificarAmbiente(){
    if(process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento"){
        return false;
       } return true;
}

function executar(instrucao) {

     if (!verificarAmbiente()) {
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }
        return new Promise(function (resolve, reject) {

        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erroConexao) {
            if (erroConexao) {
                conexao.end();
                return reject(erroConexao);
            }
            conexao.query(instrucao, function (erro, resultados) {

                conexao.end();

                if (erro) {
                    return reject(erro);
                }
                resolve(resultados);
            });
        });
    });
}

async function executarTransacao(operacao){
    if (!verificarAmbiente()) {
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {

        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erroConexao) {

            if (erroConexao) {
                conexao.end();
                return reject(erroConexao);
            }

            var conexaoPromise = conexao.promise();

            async function executarOperacao() {

                try {

                    await conexaoPromise.beginTransaction();
                    var resultado = await operacao(conexaoPromise); //permite que o model envie várias instruções SQL utilizando a mesma conexão
                    await conexaoPromise.commit();

                    resolve(resultado);

                } catch (erro) {

                    try {
                        await conexaoPromise.rollback();
                    } catch (erroRollback) {
                        console.log("Erro ao desfazer transação:", erroRollback);
                    }

                    reject(erro);

                } finally {
                    conexao.end();
                }
            }

            executarOperacao();
        });
    });
}

module.exports = {executar, executarTransacao};