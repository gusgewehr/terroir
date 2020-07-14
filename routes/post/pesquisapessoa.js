var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require("../../models/Pessoa");

const Pessoa = mongoose.model("pessoas");

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("rota pessoas pesquisa deu certo") 
  Pessoa.find().sort({criado_em: 'desc'}).lean().then( (pessoas) => {
    console.log("Pessoas find deu certo")
    res.render('new', { title: 'Terroir', pessoas: pessoas});
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as pessoas")
    res.redirect("main") 
  })
});

module.exports = router;
