//Inicializa a API, configura o Express e conecta as partes

// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });
//carregamento do arquivo escolhido anteriormente
// o pacote dotenv precisa ser instalado no projeto
//require("dotenv") - importa o pacote dotenv - lê as variáveis do arquivo e disponibiliza essas informações por meio de process.env
//.config() - executa a configuração do pacote
//({ path: caminho_env }); - informa qual arquivo deverá ser acrregado

var express = require("express");
//é utiliazdo para criar o servidor, receber requisições do front-end, definir rotas, enviar respostas, trabalhar com os dados enviados pelos usuários

var cors = require("cors");
//segurança dos navegadores

var path = require("path");
//é um módulo nativo do NOde.js
// require() - é uma forma de importar modulos no Node.js

//recuperando informações do arquivo .env.dev que foi carregado anteriormente
//permite que os outros arquivos da API acessem as configurações carregadas
var PORTA_APP = process.env.APP_PORT; 
//recupera a porta definida para a aplicação

var HOST_APP = process.env.APP_HOST;
//recupera o endereço do servidor

var app = express();

//importação dos arquivos que ficam dentro da pasta ROUTES
//cada variável recebe o conteúdo exportado pelo arquivo correspondente
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var avisosRouter = require("./src/routes/avisos");
var medidasRouter = require("./src/routes/medidas");
var aquariosRouter = require("./src/routes/aquarios");
var empresasRouter = require("./src/routes/empresas");


//permite que o express interprete dados enviados no formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//arquivos estáticos

//cors?
app.use(cors());

app.use("/", indexRouter); 
app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/medidas", medidasRouter);
app.use("/aquarios", aquariosRouter);
app.use("/empresas", empresasRouter);

//require() - importa o arquivo
//app.use() - registra as rotas na aplicação


//inicialização do servidor para receber aquisições
app.listen(PORTA_APP, function () {
    console.log(`                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
