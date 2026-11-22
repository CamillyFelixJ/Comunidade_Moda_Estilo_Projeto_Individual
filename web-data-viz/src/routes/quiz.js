var express = require("express");
var router = express.Router();

//importa o controller
var quizController = require("../controllers/quizController");

//função salvar
router.post("/salvar", function(req, res) {
    quizController.salvar(req, res);
});

router.get("/dashboard/:id_usuario", function (req, res) {
    quizController.dashboard(req, res);
});

module.exports = router;
//permite que o app.js utilize essa rota