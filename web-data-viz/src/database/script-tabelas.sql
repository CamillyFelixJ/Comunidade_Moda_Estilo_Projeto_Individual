-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE YourStyle;
USE YourStyle;

CREATE TABLE usuario (
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	cpf CHAR(11) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(100) NOT NULL
);

CREATE TABLE tentativa_quiz (
	id_tentativa_quiz INT PRIMARY KEY AUTO_INCREMENT,
	dt_realizacao DATETIME DEFAULT CURRENT_TIMESTAMP, 
    fk_usuario INT NOT NULL,
    
    CONSTRAINT ChFkUsuario FOREIGN KEY (fk_usuario)
    REFERENCES usuario(id_usuario)
);

CREATE TABLE pergunta_quiz (
	id_pergunta_quiz INT PRIMARY KEY AUTO_INCREMENT,
    enunciado VARCHAR(500),
    tipo VARCHAR(30),
    limite_selecao INT,
    ordem_importancia TINYINT,
    ordem_exibicao INT
);

CREATE TABLE alternativa_quiz(
	id_alternativa_quiz INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(400),
    rotulo VARCHAR(45),
    ordem_exibicao INT,
    fk_pergunta_quiz INT,
    
    CONSTRAINT ChFkPergunta FOREIGN KEY (fk_pergunta_quiz)
    REFERENCES pergunta_quiz(id_pergunta_quiz)
);

CREATE TABLE resposta_usuario (
	id_resposta_usuario INT PRIMARY KEY AUTO_INCREMENT,
    valor INT, 
    fk_tentativa_quiz INT,
    fk_alternativa_quiz INT,
    
    CONSTRAINT ChFkTentativa FOREIGN KEY (fk_tentativa_quiz)
    REFERENCES tentativa_quiz(id_tentativa_quiz),
    
    CONSTRAINT ChFkAlternativa FOREIGN KEY (fk_alternativa_quiz)
    REFERENCES alternativa_quiz(id_alternativa_quiz)
);

CREATE TABLE perfil_quiz(
	id_perfil_quiz INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    descricao VARCHAR(500)
);


CREATE TABLE alternativa_perfil (
    fk_alternativa_quiz INT,
    fk_perfil_quiz INT,
    peso INT NOT NULL,

    PRIMARY KEY (fk_alternativa_quiz, fk_perfil_quiz),

    FOREIGN KEY (fk_alternativa_quiz)
	REFERENCES alternativa_quiz(id_alternativa_quiz),

    FOREIGN KEY (fk_perfil_quiz)
	REFERENCES perfil_quiz(id_perfil_quiz)
);

CREATE TABLE resultado_perfil(
	id_resultado_perfil INT PRIMARY KEY AUTO_INCREMENT,
    pontuacao INT,
    fk_perfil_quiz INT,
    fk_tentativa_quiz INT,
    
    UNIQUE (fk_tentativa_quiz, fk_perfil_quiz),
    
    FOREIGN KEY (fk_perfil_quiz) 
    REFERENCES perfil_quiz(id_perfil_quiz),
    
    FOREIGN KEY (fk_tentativa_quiz) 
    REFERENCES tentativa_quiz(id_tentativa_quiz)
);


-- INSERTS --

INSERT INTO perfil_quiz (nome, descricao) VALUES
('Autêntica',  'Valoriza a expressão da própria personalidade por meio das roupas, buscando combinações que representem sua identidade e individualidade.'),
('Exploradora', 'Gosta de experimentar novos estilos, tendências, cores e combinações, descobrindo diferentes possibilidades de expressão.'),
('Prática', 'Prioriza conforto, funcionalidade e versatilidade, buscando roupas que facilitem suas escolhas e acompanhem sua rotina.'),
('Atemporal', 'Prefere peças clássicas, elegantes e versáteis, valorizando combinações equilibradas que permanecem relevantes ao longo do tempo.'),
('Adáptavel', 'Transita entre diferentes estilos e propostas, adaptando suas escolhas de acordo com a ocasião, o momento e suas preferências.');


-- ordem_exibição = a ordem em que as perguntas vão aparecer
INSERT INTO pergunta_quiz (enunciado, tipo, limite_selecao, ordem_importancia, ordem_exibicao) VALUES
('Quais estilos mais te representam?', 'multipla', 3, 1, 1),
('Quais cores predominam nas suas roupas?', 'multipla', 3, 0, 2),
('Em quais situações você sente mais dificuldade para escolher o que vestir?', 'multipla', 3, 0, 3),
('Quando você não sabe o que vestir, qual costuma ser o motivo?', 'multipla', 3, 0, 4),
('O que mais chama sua atenção em uma peça de roupa?', 'multipla', 3, 1, 5),
('Com que frequência você costuma comprar roupas?','unica', 1, 0, 6),
('Quanto você costuma gastar mensalmente com roupas?', 'unica', 1, 0, 7),
('Quais categorias você mais compra?', 'multipla', 3, 1, 8),
('Em que medida cada afirmação descreve você na hora de comprar roupas?', 'escala', 6, 0, 9),
('Quando você monta um look, o que mais importa para você?', 'unica', 1, 0, 10);




INSERT INTO alternativa_quiz (texto, rotulo, fk_pergunta_quiz, ordem_exibicao) VALUES
-- questão1
('Casual', NULL, 1, 1),
('Romântico', NULL, 1, 2),
('Minimalista', NULL, 1, 3),
('Elegante', NULL, 1, 4),
('Moderno', NULL, 1, 5),
('Esportivo', NULL, 1, 6),
('StreetWear', NULL, 1, 7),
('Boho', NULL, 1, 8),
('Ainda estou descobrindo meu estilo', NULL, 1, 9),
-- questão2
('Preto e branco', NULL, 2, 1),
('Tons neutros (bege, marrom, cinza)', NULL, 2, 2),
('Tons pastéis', NULL, 2, 3),
('Cores vibrantes', NULL, 2, 4),
('Tons terrosos', NULL, 2, 5),
('Estampas e combinações', NULL, 2, 6),
-- questão3
('Trabalho, faculdade ou compromissos profissionais — encontrar roupas adequadas sem abrir mão do meu estilo.', NULL, 3, 1),
('Festas, aniversários e eventos especiais — escolher uma produção que combine com a ocasião.', NULL, 3, 2),
('Encontros e passeios — encontrar um look que me faça sentir bonita e confiante.', NULL, 3, 3),
('Ocasiões que exigem mais formalidade — montar uma combinação mais sofisticada e apropriada.', NULL, 3, 4),
('Dia a dia e rotina — variar as combinações sem repetir sempre os mesmos looks.', NULL, 3, 5),
('Viagens e ocasiões fora da rotina — escolher peças adequadas ao destino, clima e atividades.', NULL, 3, 6),
-- questão 4
('Tenho muita roupa, mas nada parece combinar com o que quero', NULL, 4, 1),
('Não tenho peças suficientes ou adequadas', NULL, 4, 2),
('Não sei qual estilo combina comigo', NULL, 4, 3),
('Tenho dificuldade para montar combinações diferentes', NULL, 4, 4),
('Me preocupo com o que os outros vão pensar', NULL, 4, 5),
('Minhas roupas não servem ou não me deixam confortável', NULL, 4, 6),
('Raramente tenho dificuldade para escolher o que vestir', NULL, 4, 7),
-- questão 5
('Preço e custo-benefício', NULL, 5, 1),
('Conforto', NULL, 5, 2),
('Beleza e aparência', NULL, 5, 3),
('Tendências da moda', NULL, 5, 4),
('Versatilidade (combina com várias peças)', NULL, 5, 5),
('Qualidade e durabilidade', NULL, 5, 6),
-- questão 6
('Toda semana', NULL, 6, 1),
('A cada 15 dias', NULL, 6, 2),
('Uma vez por mês', NULL, 6, 3),
('A cada 2 ou 3 meses', NULL, 6, 4),
('Algumas vezes ao ano', NULL, 6, 5),
('Somente quando necessário', NULL, 6, 6),
-- questão 7
('Até R$ 100', NULL, 7, 1),
('De R$ 100 a R$ 200', NULL, 7, 2),
('De R$ 200 a R$ 400', NULL, 7, 3),
('De R$ 400 a R$ 800', NULL, 7, 4),
('Acima de R$ 800', NULL, 7, 5),
('Não tenho um valor definido', NULL, 7, 6),
-- questão 8
('Blusas e camisetas', NULL, 8, 1),
('Calças e shorts', NULL, 8, 2),
('Vestidos e saias', NULL, 8, 3),
('Calçados', NULL, 8, 4),
('Bolsas e acessórios', NULL, 8, 5),
('Casacos e jaquetas', NULL, 8, 6),
-- questão 9
('Planejo minhas compras com antecedência', 'Planejamento', 9, 1),
('Pesquiso bastante antes de comprar', 'Pesquisa', 9, 2),
('Compro quando encontro algo de que gosto', 'Compra por interesse', 9, 3),
('Costumo comprar por impulso', 'Compra por impulso', 9, 4),
('Compro quando preciso substituir alguma peça', 'Reposição', 9, 5),
('Tenho peças no guarda-roupa que quase nunca uso','Peças pouco utilizadas', 9, 6),
-- questão 10
('Expressar minha personalidade e identidade', NULL, 10, 1),
('Sentir-me confortável e confiante', NULL, 10, 2),
('Transmitir elegância e sofisticação', NULL, 10, 3),
('Experimentar tendências e novas combinações', NULL, 10, 4),
('Ter praticidade e versatilidade no dia a dia', NULL, 10, 5);


-- -----------------------------------------------------
-- 3. PESOS (fk_alternativa_quiz, fk_perfil_quiz, peso)
-- O peso JÁ INCLUI o "peso" da pergunta no JS:
--   perguntas 1 a 6 = x1 | pergunta 8 = x0,5 | pergunta 9 = x2 | pergunta 10 = x3
-- O multiplicador de posição (3-2-1) e o da escala ficam no cálculo (seção 4).
-- Pergunta 7 não pontua nenhum perfil (igual ao JS).
-- -----------------------------------------------------

INSERT INTO alternativa_perfil (fk_alternativa_quiz, fk_perfil_quiz, peso) VALUES
(1, 3, 1), (1, 5, 1),     -- Casual       -> Prática, Adaptável
(2, 1, 1),                -- Romântico    -> Autêntica
(3, 4, 1), (3, 3, 1),     -- Minimalista  -> Atemporal, Prática
(4, 4, 1),                -- Elegante     -> Atemporal
(5, 2, 1),                -- Moderno      -> Exploradora
(6, 3, 1),                -- Esportivo    -> Prática
(7, 1, 1), (7, 2, 1),     -- StreetWear   -> Autêntica, Exploradora
(8, 1, 1),                -- Boho         -> Autêntica
(9, 2, 1),                -- Ainda estou descobrindo -> Exploradora
-- Pergunta 2: cores
(10, 4, 1),               -- Preto e branco   -> Atemporal
(11, 4, 1), (11, 5, 1),   -- Tons neutros     -> Atemporal, Adaptável
(12, 5, 1),               -- Tons pastéis     -> Adaptável
(13, 2, 1), (13, 1, 1),   -- Cores vibrantes  -> Exploradora, Autêntica
(14, 1, 1),               -- Tons terrosos    -> Autêntica
(15, 1, 1), (15, 2, 1),   -- Estampas         -> Autêntica, Exploradora
-- Pergunta 3: situações de dificuldade
(16, 5, 1),               -- Trabalho, faculdade -> Adaptável
(17, 2, 1),               -- Festas              -> Exploradora
(18, 1, 1),               -- Encontros           -> Autêntica
(19, 4, 1),               -- Formalidade         -> Atemporal
(20, 3, 1), (20, 5, 1),   -- Dia a dia           -> Prática, Adaptável
(21, 3, 1),               -- Viagens             -> Prática
-- Pergunta 4: motivos (22 a 28; as alternativas 26 e 28 não pontuam)
(22, 5, 1),               -- Muita roupa              -> Adaptável
(23, 3, 1),               -- Não tenho peças          -> Prática
(24, 2, 1),               -- Não sei qual estilo      -> Exploradora
(25, 5, 1), (25, 2, 1),   -- Dificuldade p/ montar    -> Adaptável, Exploradora
(27, 3, 1),               -- Roupas não servem        -> Prática
-- Pergunta 5: o que chama atenção (ordenada)
(29, 3, 1),               -- Preço          -> Prática
(30, 3, 1),               -- Conforto       -> Prática
(31, 1, 1),               -- Beleza         -> Autêntica
(32, 2, 1),               -- Tendências     -> Exploradora
(33, 5, 1),               -- Versatilidade  -> Adaptável
(34, 4, 1),               -- Qualidade      -> Atemporal
-- Pergunta 6: frequência (37 "Uma vez por mês" não pontua)
(35, 2, 1),               -- Toda semana              -> Exploradora
(36, 2, 1),               -- A cada 15 dias           -> Exploradora
(38, 5, 1),               -- A cada 2 ou 3 meses      -> Adaptável
(39, 4, 1),               -- Algumas vezes ao ano     -> Atemporal
(40, 3, 1),               -- Somente quando necessário -> Prática
-- Pergunta 8: categorias (ordenada, peso da pergunta = 0,5)
(47, 3, 0.5), (47, 5, 0.5),   -- Blusas   -> Prática, Adaptável
(48, 3, 0.5),                 -- Calças   -> Prática
(49, 1, 0.5),                 -- Vestidos -> Autêntica
(50, 2, 0.5),                 -- Calçados -> Exploradora
(51, 4, 0.5), (51, 1, 0.5),   -- Bolsas   -> Atemporal, Autêntica
(52, 4, 0.5),                 -- Casacos  -> Atemporal
-- Pergunta 9: escala (peso da pergunta = 2; 58 "peças pouco utilizadas" não pontua)
(53, 4, 2), (53, 3, 2),   -- Planeja   -> Atemporal, Prática
(54, 4, 2), (54, 5, 2),   -- Pesquisa  -> Atemporal, Adaptável
(55, 1, 2),               -- Gosto     -> Autêntica
(56, 2, 2),               -- Impulso   -> Exploradora
(57, 3, 2),               -- Reposição -> Prática
-- Pergunta 10: o que importa no look (peso da pergunta = 3, desempate)
(59, 1, 3),               -- Expressar     -> Autêntica
(60, 3, 3),               -- Sentir-me     -> Prática
(61, 4, 3),               -- Transmitir    -> Atemporal
(62, 2, 3),               -- Experimentar  -> Exploradora
(63, 5, 3);               -- Praticidade   -> Adaptável




-- CÁLCULO DO PERFIL 
--   pergunta ordenada (1, 5, 8): posição 1 = x3, 2 = x2, 3 = x1
--   pergunta de escala (9): (nota - 1) / 4
--   demais: x1

