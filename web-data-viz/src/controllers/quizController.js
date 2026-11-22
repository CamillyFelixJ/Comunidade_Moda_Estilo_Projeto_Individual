var quizModel = require("../models/quizModel");

function salvar(req, res){

    var id_usuario = req.body.id_usuario;
    var respostas = req.body.respostas;

    if(id_usuario == undefined){
        res.status(400).send("O IDdo usuário não foi informado!");
    }else if(respostas == undefined || respostas.length == 0){
        res.status(400).send("As respostas do quiz não foram informadas!")
    }else{
        quizModel.salvar(id_usuario, respostas).then(function(resultado){
            res.status(201).json(resultado);
        })
        .catch(function(erro){
            console.log(erro);
            res.status(500).json(erro);
        });
    }
}

function dashboard(req, res) {

    var id_usuario = req.params.id_usuario;

    quizModel.buscarDashboard(id_usuario).then(function (dados) {

        if (dados == null) {
            res.status(404).send("Este usuário ainda não fez o quiz.");
        } else {
            res.json(dados);
        }

    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro);
    });
}

module.exports = { salvar, dashboard };


// req.body.idUsuario: recebe o ID do usuário enviado pelo front-end.

// req.body.respostas: recebe as respostas selecionadas no quiz.

// res.status(400): informa que existe algum problema nos dados recebidos.

// quizModel.salvar(): chama a função do model para salvar as informações.

// .then(): executa quando o model consegue concluir a operação.

// .catch(): trata algum erro que aconteça durante a operação.

// res.status(201): indica que o registro foi criado com sucesso.