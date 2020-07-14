var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require("../../models/Pessoa");

const Pessoa = mongoose.model("pessoas");


router.post('/', function(req, res, next) {
  var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
      erros.push({texto: "Nome inválido"})
    };
    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
      erros.push({texto: "Endereco inválido"})
    };
    if (isNaN(req.body.telefone)){
      erros.push({texto: "Telefone inválido"})
    };
    if (isNaN(req.body.cpf)){
      erros.push({texto: "CPF inválido, remova caracteres epeciais"})
    };

    if(erros.length > 0){
      res.render('new', {erros: erros})
    }
    else {
      const novaPessoa = {    
        nome: req.body.nome.toUpperCase(),
        telefone: req.body.telefone,      
        endereco: req.body.endereco.toUpperCase(),
        cpf: req.body.cpf      
      }

      new Pessoa(novaPessoa).save().then(() => {
        req.flash("success_msg", "Pessoa cadastrada com sucesso")
        res.redirect("/new")      
      }).catch((err) => {
        req.flash("Houve um erro ao cadastrar a pessoa");
        res.redirect("/new") 
      });
    }
});

module.exports = router;