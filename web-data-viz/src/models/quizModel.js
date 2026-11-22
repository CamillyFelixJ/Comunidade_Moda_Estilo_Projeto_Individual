var database = require("../database/config");

// Pergunta 9: o front manda o código da afirmação; no banco ela é identificada pela posição
var POSICAO_ESCALA = {
    planeja: 1,
    pesquisa: 2,
    gosto: 3,
    impulso: 4,
    reposicao: 5,
    subutilizadas: 6
};

async function criarTentativa(id_usuario, conexao) {
    var instrucaoSql = `INSERT INTO tentativa_quiz (fk_usuario) VALUES (?);`;
    var resultado = await conexao.execute(instrucaoSql, [id_usuario]);
    return resultado[0].insertId;
}

async function buscarIdAlternativa(id_pergunta, resposta, conexao) {
    var instrucaoSql;
    var parametros;

    if (id_pergunta == 9) {
        instrucaoSql = `
            SELECT id_alternativa_quiz FROM alternativa_quiz
            WHERE fk_pergunta_quiz = ? AND ordem_exibicao = ?;`;
        parametros = [id_pergunta, POSICAO_ESCALA[resposta.id]];
    } else {
        instrucaoSql = `
            SELECT id_alternativa_quiz FROM alternativa_quiz
            WHERE fk_pergunta_quiz = ? AND TRIM(texto) = ?;`;
        parametros = [id_pergunta, String(resposta).trim()];
    }

    var resultado = await conexao.execute(instrucaoSql, parametros);
    var linhas = resultado[0];

    if (linhas.length == 0) {
        throw new Error("Alternativa não encontrada. Pergunta " + id_pergunta + ": " + JSON.stringify(resposta));
    }

    return linhas[0].id_alternativa_quiz;
}

async function salvarRespostas(id_tentativa, respostas, conexao) {

    for (var i = 0; i < respostas.length; i++) {
        var perguntaAtual = respostas[i];

        for (var cont = 0; cont < perguntaAtual.respostas.length; cont++) {
            var respostaAtual = perguntaAtual.respostas[cont];
            var valor = null;

            if (perguntaAtual.id == 9) {
                // escala: valor = nota de 1 a 5
                valor = respostaAtual.nota;
            } else if (perguntaAtual.id == 1 || perguntaAtual.id == 5 || perguntaAtual.id == 8) {
                // ordem de importância: valor = posição (1º, 2º, 3º)
                valor = cont + 1;
            }

            var id_alternativa = await buscarIdAlternativa(perguntaAtual.id, respostaAtual, conexao);

            var instrucaoSql = `
                INSERT INTO resposta_usuario (valor, fk_tentativa_quiz, fk_alternativa_quiz)
                VALUES (?, ?, ?);`;

            await conexao.execute(instrucaoSql, [valor, id_tentativa, id_alternativa]);
        }
    }
}

async function salvar(id_usuario, respostas) {

    return database.executarTransacao(async function (conexao) {
        var id_tentativa = await criarTentativa(id_usuario, conexao);
        await salvarRespostas(id_tentativa, respostas, conexao);
        await salvarResultado(id_tentativa, conexao);

        return {
            mensagem: "Quiz salvo com sucesso!",
            id_tentativa: id_tentativa
        };
    });
}

async function calcularPontuacoes(id_tentativa, conexao) {
    var instrucaoSql = `
        
SELECT
    p.id_perfil_quiz,
    p.nome,

    COALESCE(SUM(
        CASE
            WHEN ru.id_resposta_usuario IS NOT NULL THEN
                ap.peso *
                CASE
                    WHEN pq.id_pergunta_quiz IN (1, 5, 8) THEN
                        CASE ru.valor
                            WHEN 1 THEN 3
                            WHEN 2 THEN 2
                            WHEN 3 THEN 1
                            ELSE 0
                        END

                    WHEN pq.id_pergunta_quiz = 9 THEN
                        (ru.valor - 1) / 4

                    ELSE 1
                END
            ELSE 0
        END
    ), 0) AS pontuacao

FROM perfil_quiz AS p

LEFT JOIN alternativa_perfil AS ap
    ON p.id_perfil_quiz = ap.fk_perfil_quiz

LEFT JOIN alternativa_quiz AS aq
    ON aq.id_alternativa_quiz = ap.fk_alternativa_quiz

LEFT JOIN pergunta_quiz AS pq
    ON pq.id_pergunta_quiz = aq.fk_pergunta_quiz

LEFT JOIN resposta_usuario AS ru
    ON aq.id_alternativa_quiz = ru.fk_alternativa_quiz
    AND ru.fk_tentativa_quiz = ?

GROUP BY p.id_perfil_quiz, p.nome

ORDER BY pontuacao DESC;
`;

var resultado = await conexao.execute(instrucaoSql, [id_tentativa]);
return resultado[0];
}

async function salvarResultado(id_tentativa, conexao) {

    var pontuacoes = await calcularPontuacoes(id_tentativa, conexao);

    for (var i = 0; i < pontuacoes.length; i++) {

        var instrucaoSql = `
            INSERT INTO resultado_perfil (pontuacao, fk_perfil_quiz, fk_tentativa_quiz) VALUES (?, ?, ?);`;

        await conexao.execute(instrucaoSql, [
            Number(pontuacoes[i].pontuacao),
            pontuacoes[i].id_perfil_quiz,
            id_tentativa
        ]);
    }
}


async function buscarDashboard(id_usuario) {

    return database.executarTransacao(async function (conexao) {

        // 1. Buscar a última tentativa do usuário
        var tentativa = await conexao.execute(`
            SELECT id_tentativa_quiz
            FROM tentativa_quiz
            WHERE fk_usuario = ?
            ORDER BY dt_realizacao DESC, id_tentativa_quiz DESC
            LIMIT 1;
        `, [id_usuario]);

        // Se não existir tentativa, não existe dashboard
        if (tentativa[0].length == 0) {
            return null;
        }

        var id_tentativa = tentativa[0][0].id_tentativa_quiz;


        // 2. Buscar os resultados dos perfis dessa tentativa
        var perfil = await conexao.execute(`
            SELECT p.id_perfil_quiz,
                   p.nome,
                   rp.pontuacao
            FROM resultado_perfil AS rp
            JOIN perfil_quiz AS p
                ON p.id_perfil_quiz = rp.fk_perfil_quiz
            WHERE rp.fk_tentativa_quiz = ?
            ORDER BY rp.pontuacao DESC;
        `, [id_tentativa]);

        // Se não existir resultado, não exibe a dashboard
        if (perfil[0].length == 0) {
            return null;
        }


        // 3. Buscar todas as respostas dessa tentativa
        var respostas = await conexao.execute(`
            SELECT aq.fk_pergunta_quiz AS pergunta,
                   aq.texto,
                   aq.rotulo,
                   ru.valor
            FROM resposta_usuario AS ru
            JOIN alternativa_quiz AS aq
                ON aq.id_alternativa_quiz = ru.fk_alternativa_quiz
            WHERE ru.fk_tentativa_quiz = ?
            ORDER BY aq.fk_pergunta_quiz, ru.valor, aq.ordem_exibicao;
        `, [id_tentativa]);


        // 4. Retornar os dados
        return {
            id_tentativa: id_tentativa,
            perfil: perfil[0][0],
            respostas: respostas[0]
        };
    });
}


module.exports = { criarTentativa, salvarRespostas, salvar, buscarDashboard };