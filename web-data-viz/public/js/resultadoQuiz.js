// ============================================================
// PERFIS DE ESTILO – textos e cálculo da pontuação
// Usado por quiz.html (calcula) e resultado.html (exibe)
// ============================================================

const CHAVE_RESULTADO = "resultado_quiz";

const PERFIS = {
    autentica: {
        nome: "Autêntica",
        descricao: "Você gosta de expressar quem é por meio das suas escolhas. Para você, a moda é uma forma de mostrar sua personalidade, criar sua própria identidade e fugir do que é esperado. Seu estilo não precisa seguir regras: ele precisa ter a sua essência."
    },
    exploradora: {
        nome: "Exploradora",
        descricao: "Você está sempre aberta a novas possibilidades! Gosta de conhecer tendências, experimentar combinações e descobrir maneiras diferentes de se vestir. Para você, a moda é um espaço de criatividade, descobertas e liberdade para se reinventar."
    },
    pratica: {
        nome: "Prática",
        descricao: "Você acredita que se vestir bem também significa se sentir confortável e segura. Prefere escolhas que facilitem sua rotina, sem deixar de lado sua personalidade. Para você, encontrar uma roupa ideal é unir bem-estar, simplicidade e confiança."
    },
    atemporal: {
        nome: "Atemporal",
        descricao: "Você valoriza a elegância que vai além das tendências. Gosta de peças clássicas, combinações equilibradas e detalhes que fazem a diferença. Para você, a moda está na beleza dos detalhes, na qualidade e na sofisticação que nunca sai de cena."
    },
    adaptavel: {
        nome: "Adaptável",
        descricao: "Você gosta de encontrar diferentes possibilidades em uma mesma peça. Valoriza roupas versáteis, combinações que funcionam em várias ocasiões e escolhas que acompanham seu ritmo. Para você, a moda é ter liberdade para adaptar seu estilo a diferentes momentos sem perder sua identidade."
    }
};

// ------------------------------------------------------------
// REGRAS DE PONTUAÇÃO (edite aqui para ajustar o resultado)
//
// Cada questão (pelo id) tem:
//   peso      -> multiplicador da questão
//   ordenada  -> true se a ordem de escolha importa (1ª = 3 pts, 2ª = 2, 3ª = 1)
//   desempate -> true se a questão também serve para desempatar perfis
//   opcoes    -> { "início do texto da opção": { perfil: pontos } }
//
// As opções são encontradas pelo INÍCIO do texto, então não é preciso
// copiar a frase inteira (e espaços sobrando no fim não atrapalham).
// As questões 7 (gasto mensal) e algumas opções não pontuam perfil.
// ------------------------------------------------------------
const PESOS_ORDEM = [3, 2, 1];

const REGRAS = {

    // Estilos que mais representam
    1: {
        peso: 1, ordenada: true, desempate: true,
        opcoes: {
            "Casual": { pratica: 1, adaptavel: 1 },
            "Romântico": { autentica: 1 },
            "Minimalista": { atemporal: 1, pratica: 1 },
            "Elegante": { atemporal: 1 },
            "Moderno": { exploradora: 1 },
            "Esportivo": { pratica: 1 },
            "StreetWear": { autentica: 1, exploradora: 1 },
            "Boho": { autentica: 1 },
            "Ainda estou descobrindo": { exploradora: 1 }
        }
    },

    // Cores predominantes
    2: {
        peso: 1, ordenada: false,
        opcoes: {
            "Preto e branco": { atemporal: 1 },
            "Tons neutros": { atemporal: 1, adaptavel: 1 },
            "Tons pastéis": { adaptavel: 1 },
            "Cores vibrantes": { exploradora: 1, autentica: 1 },
            "Tons terrosos": { autentica: 1 },
            "Estampas e combinações": { autentica: 1, exploradora: 1 }
        }
    },

    // Situações de dificuldade
    3: {
        peso: 1, ordenada: false,
        opcoes: {
            "Trabalho, faculdade": { adaptavel: 1 },
            "Festas, aniversários": { exploradora: 1 },
            "Encontros e passeios": { autentica: 1 },
            "Ocasiões que exigem": { atemporal: 1 },
            "Dia a dia e rotina": { pratica: 1, adaptavel: 1 },
            "Viagens e ocasiões": { pratica: 1 }
        }
    },

    // Motivos de dificuldade
    4: {
        peso: 1, ordenada: false,
        opcoes: {
            "Tenho muita roupa": { adaptavel: 1 },
            "Não tenho peças": { pratica: 1 },
            "Não sei qual estilo": { exploradora: 1 },
            "Tenho dificuldade para montar": { adaptavel: 1, exploradora: 1 },
            "Me preocupo": {},
            "Minhas roupas não servem": { pratica: 1 },
            "Raramente": {}
        }
    },

    // O que chama atenção em uma peça
    5: {
        peso: 1, ordenada: true,
        opcoes: {
            "Preço": { pratica: 1 },
            "Conforto": { pratica: 1 },
            "Beleza": { autentica: 1 },
            "Tendências": { exploradora: 1 },
            "Versatilidade": { adaptavel: 1 },
            "Qualidade": { atemporal: 1 }
        }
    },

    // Frequência de compras
    6: {
        peso: 1, ordenada: false,
        opcoes: {
            "Toda semana": { exploradora: 1 },
            "A cada 15 dias": { exploradora: 1 },
            "Uma vez por mês": {},
            "A cada 2 ou 3 meses": { adaptavel: 1 },
            "Algumas vezes ao ano": { atemporal: 1 },
            "Somente quando necessário": { pratica: 1 }
        }
    },

    // Categorias mais compradas (peso menor)
    8: {
        peso: 0.5, ordenada: true,
        opcoes: {
            "Blusas": { pratica: 1, adaptavel: 1 },
            "Calças": { pratica: 1 },
            "Vestidos": { autentica: 1 },
            "Calçados": { exploradora: 1 },
            "Bolsas": { atemporal: 1, autentica: 1 },
            "Casacos": { atemporal: 1 }
        }
    },

    // Escala de 1 a 5 – cada afirmação vale (nota - 1) / 4 do peso
    9: {
        peso: 2, escala: true,
        afirmacoes: {
            "planeja": { atemporal: 1, pratica: 1 },
            "pesquisa": { atemporal: 1, adaptavel: 1 },
            "gosto": { autentica: 1 },
            "impulso": { exploradora: 1 },
            "reposicao": { pratica: 1 }
        }
    },

    // O que mais importa no look (escolha única, peso alto)
    10: {
        peso: 3, ordenada: false, desempate: true,
        opcoes: {
            "Expressar": { autentica: 1 },
            "Sentir-me": { pratica: 1 },
            "Transmitir": { atemporal: 1 },
            "Experimentar": { exploradora: 1 },
            "Ter praticidade": { adaptavel: 1 }
        }
    }
};

// Procura a regra de uma opção pelo início do texto
function acharPontosDaOpcao(regra, textoOpcao) {

    const texto = String(textoOpcao).trim();

    for (const inicio in regra.opcoes) {
        if (texto.indexOf(inicio) === 0) {
            return regra.opcoes[inicio];
        }
    }

    return {};
}

// Arredonda os percentuais para somarem exatamente 100
function arredondarPercentuais(valores) {

    const total = valores.reduce((a, b) => a + b, 0);
    const brutos = valores.map(v => (v / total) * 100);
    const inteiros = brutos.map(Math.floor);

    let sobra = 100 - inteiros.reduce((a, b) => a + b, 0);

    const porFracao = brutos
        .map((v, i) => ({ i: i, fracao: v - Math.floor(v) }))
        .sort((a, b) => b.fracao - a.fracao);

    for (let k = 0; k < sobra; k++) {
        inteiros[porFracao[k % porFracao.length].i]++;
    }

    return inteiros;
}

// Recebe respostasUsuario (do quiz) e devolve o resultado final
function calcularPerfil(respostas) {

    const pontos = {};
    const desempate = {};

    for (const chave in PERFIS) {
        pontos[chave] = 0;
        desempate[chave] = 0;
    }

    for (let i = 0; i < respostas.length; i++) {

        const resposta = respostas[i];
        const regra = REGRAS[resposta.id];

        if (!regra) continue;

        // Questão de escala (objetos { id, nota })
        if (regra.escala) {

            for (let j = 0; j < resposta.respostas.length; j++) {

                const item = resposta.respostas[j];
                const perfis = regra.afirmacoes[item.id];

                if (!perfis) continue;

                const fator = (item.nota - 1) / 4;

                for (const chave in perfis) {
                    pontos[chave] += perfis[chave] * fator * regra.peso;
                }
            }

            continue;
        }

        // Questões de alternativas
        for (let j = 0; j < resposta.respostas.length; j++) {

            const perfis = acharPontosDaOpcao(regra, resposta.respostas[j]);
            const posicao = regra.ordenada ? (PESOS_ORDEM[j] || 1) : 1;

            for (const chave in perfis) {

                const ganho = perfis[chave] * posicao * regra.peso;

                pontos[chave] += ganho;

                if (regra.desempate) desempate[chave] += ganho;
            }
        }
    }

    // Ordena por pontos; em caso de empate, usa as questões 1 e 10
    const ranking = Object.keys(PERFIS).sort(function (a, b) {
        return (pontos[b] - pontos[a]) || (desempate[b] - desempate[a]);
    });

    // Principal + até 2 perfis que também combinam (só quem pontuou)
    let top = ranking.slice(0, 3).filter(chave => pontos[chave] > 0);

    if (top.length === 0) top = [ranking[0]];

    const percentuais = arredondarPercentuais(top.map(chave => pontos[chave]));

    const lista = top.map(function (chave, i) {
        return {
            chave: chave,
            nome: PERFIS[chave].nome,
            percentual: percentuais[i]
        };
    });

    return {
        principal: lista[0],
        outros: lista.slice(1),
        pontos: pontos,
        respostas: respostas,
        data: new Date().toISOString()
    };
}
