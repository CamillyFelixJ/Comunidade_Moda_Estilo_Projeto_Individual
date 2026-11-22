# YOUR STYLE — API

## 1. Sobre o projeto

O **Your Style** é um projeto individual desenvolvido como parte da disciplina de Pesquisa e Inovação da minha faculdade.
A proposta é criar uma plataforma voltada à moda, ao estilo pessoal e à expressão da identidade por meio das roupas. 
O sistema permite que os usuários descubram características relacionadas ao seu estilo, respondam a um quiz de perfil e visualizem informações sobre seus hábitos e escolhas relacionadas à moda.
A aplicação possui uma área pública e uma área restrita, acessível após o cadastro e login.

## 2. Objetivo da API

A API é responsável por realizar a comunicação entre o front-end e o banco de dados MySQL.

principais responsabilidades são:

- Cadastrar novos usuários.
- Realizar o login e validar as credenciais.
- Armazenar e consultar informações dos usuários.
- Receber e armazenar as respostas do quiz.
- Processar informações necessárias para a geração dos resultados.
- Disponibilizar dados para a dashboard.
- Permitir o gerenciamento das funcionalidades da área restrita.

As funcionalidades serão implementadas gradualmente.

## 3. Tecnologias utilizadas


Node.js - Ambiente de execução JavaScript 
Express - biblioteca - Criação e gerenciamento das rotas da API 
MySQL - Banco de dados 
MySQL2 - biblioteca - Comunicação entre Node.js e MySQL 
JavaScript
HTML e CSS Estrutura e estilização do front-end

## 4. Arquitetura do projeto

O projeto utiliza uma organização baseada na separação de responsabilidades.

A estrutura segue o padrão de organização abaixo, devendo ser respeitada a estrutura já existente nos arquivos:

app.js: configura a aplicação Express, middlewares e rotas.
routes: define os endpoints e direciona as requisições para os controllers.
controllers: recebe as requisições, valida os dados e controla o fluxo das operações.
models: contém as operações de comunicação com o banco de dados.
config: concentra configurações da aplicação.
database.js: realiza a configuração da conexão com o MySQL.
.env: armazena variáveis de ambiente e informações sensíveis.

### Funcionamento

O funcionamento esperado da aplicação é:

1. O usuário realiza uma ação no front-end.
2. O front-end envia uma requisição HTTP para a API.
3. A rota identifica qual operação deve ser executada.
4. O controller recebe e trata a requisição.
5. O model realiza a operação necessária no banco de dados.
6. O banco retorna os dados ou o resultado da operação.
7. A API envia uma resposta ao front-end.

**Front-end → Routes → Controllers → Models → MySQL**

## 5. Banco de dados

O banco de dados utilizado no projeto é o MySQL.

O banco possui o nome: `yourStyle`

### Tabela de usuário

A estrutura inicial planejada para a tabela `usuario` contém:


id_usuario - Identificador único e auto incremento
nome - Nome do usuário
cpf - CPF único do usuário
email - E-mail único do usuário
senha - Senha armazenada 

Outras tabelas serão desenvolvidas conforme a implementação das funcionalidades.

### Futuras estruturas

O banco irá armazenar informações relacionadas a:

- Respostas do quiz.
- Perfis e resultados do quiz.
- Preferências de estilo.
- Informações utilizadas na dashboard.

## 6. Funcionalidades do sistema

### 6.1 Cadastro e login

O sistema deve permitir que novos usuários criem uma conta e que usuários cadastrados acessem a área restrita.

O cadastro deverá verificar os dados obrigatórios e impedir a duplicidade de CPF e e-mail.

As senhas devem ser armazenadas no banco de dados.

O login deverá validar as credenciais e permitir o acesso às funcionalidades restritas.

### 6.2 Quiz de estilo e comportamento

O quiz tem como objetivo identificar características relacionadas à personalidade, à relação com a moda, às preferências estéticas e aos hábitos de consumo.

A estrutura planejada possui 10 perguntas, divididas em diferentes objetivos:

**Identidade e preferências**
- Estilos que mais representam o usuário.
- Cores predominantes nas roupas.

**Necessidades pessoais**
- Ocasiões em que encontra dificuldades para escolher roupas.
- Principais dificuldades relacionadas ao guarda-roupa.

**Motivações e comportamento**
- O que desperta o interesse por uma peça.
- Frequência de compra de roupas.
- Faixa de gasto mensal.
- Categorias de roupas compradas.
- Fatores que influenciam as decisões de compra.
- O que mais importa na hora de escolher uma roupa.

O quiz deverá separar as informações utilizadas na classificação do perfil daquelas destinadas à dashboard.

### 6.3 Perfis finais

O resultado do quiz deverá apresentar um perfil predominante relacionado à personalidade e à relação do usuário com a moda.

Os cinco perfis não devem simplesmente repetir os estilos estéticos escolhidos nas perguntas.
As preferências estéticas devem complementar a descrição do resultado.
A classificação deverá considerar as respostas correspondeentes, com pesos definidos para cada pergunta.

Não utilizar informações financeiras ou frequência de compras como determinantes do perfil estético.

### 6.4 Dashboard

A dashboard será uma área restrita destinada à visualização de informações sobre o usuário.

Estrutura:

- Resultado do quiz - perfil comportamental. KPI-1
- Distribuição dos estilos predominantes. KPI-2
- Frequência de compras. KPI-3
- Faixas de gastos mensais. KPI-4
- Comportamento de compras. Gráfico de barras
- Fatores importantes na hora da compra de uma peça. Gráfico de pizza


Os gráficos deverão representar corretamente o tipo de informação coletada, considerando que algumas perguntas permitem múltiplas respostas.

## 7. Orientações para desenvolvimento com IA

Este documento também serve como referência para ferramentas de IA, como OpenCode.

Ao trabalhar neste projeto, siga estas orientações:

1. Antes de modificar qualquer arquivo, analise a estrutura existente e entenda como os arquivos se relacionam.
2. Não recrie a API do zero se a estrutura atual já atender à necessidade.
3. Preserve os padrões de organização e nomenclatura já utilizados.
4. Não altere arquivos que não estejam relacionados à funcionalidade solicitada.
5. Não crie rotas, tabelas ou funcionalidades desnecessárias.
6. Utilize JavaScript e as tecnologias já presentes no projeto.
7. Mantenha a separação de responsabilidades entre routes, controllers e models.
8. Utilize consultas SQL compatíveis com a estrutura real do banco de dados.
9. Não invente nomes de tabelas, colunas ou relacionamentos. Consulte a modelagem existente antes de escrever consultas.
10. Não substitua códigos existentes sem explicar o motivo.
11. Sempre informe quais arquivos precisam ser criados ou modificados e questione caso encontre alguma dúvida ou ambiguidade.
12. Explique o funcionamento do código implementado, principalmente quando envolver conceitos novos.

## Importante: meu nível de conhecimento

O projeto também tem finalidade acadêmica e de aprendizagem.

Estou desenvolvendo meus conhecimentos em JavaScript, Node.js, Express, MySQL e integração entre front-end e back-end.

Por isso:

- Escolha soluções simples e didáticas.
- Evite complexidade desnecessárias.
- Não utilize bibliotecas ou tecnologias adicionais sem necessidade.
- Explique os métodos, funções, parâmetros e estruturas utilizados.
- Quando modificar um código, explique o que foi alterado e por quê.
- Priorize códigos que eu consiga compreender, apresentar e explicar aos professores.
**Não faça alterações automaticamente em partes do projeto que não foram solicitadas.**

## 9. Como executar o projeto

Os comandos e scripts devem seguir a configuração existente no `package.json`.

No geral, a execução envolve:

1. Instalar as dependências do projeto.
2. Configurar as variáveis de ambiente.
3. Criar e configurar o banco de dados MySQL.
4. Iniciar a API utilizando o script configurado no projeto.

Não assumir portas, credenciais ou scripts sem antes verificar os arquivos de configuração.


**O objetivo não é apenas fazer o código funcionar, mas construir uma aplicação organizada, funcional e que eu consiga compreender e explicar, contribuindo para o meu desenvolvimento acadêmico.**