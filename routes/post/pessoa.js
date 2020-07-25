var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require("../../models/Pessoa");

const Pessoa = mongoose.model("pessoas");

//CRIA UMA PESSOA NO DB
router.post('/', function(req, res, next) {
  //array de erros da validação, é enviado caso seja maior que 0
  var erros = [];
    //validação do formulario
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

    //se não deu erro => erros == 0
    else {
      //se não tiver recebido id, grava novo
      if(!req.body.id || typeof req.body.id == undefined || req.body.id == null){
        const novaPessoa = {  
          nome: req.body.nome.toUpperCase(),
          telefone: req.body.telefone,      
          endereco: req.body.endereco.toUpperCase(),
          cpf: req.body.cpf      
        }

        new Pessoa(novaPessoa).save().then(() => {
          req.flash("success_msg", "Pessoa cadastrada com sucesso")
          res.redirect('/new')      
        }).catch((err) => {
          req.flash("Houve um erro ao cadastrar a pessoa");
          res.redirect('/new') 
        });
      }
      //se tiver recebido id, EDITA UMA PESSOA NO DB
      else{
        Pessoa.findOneAndUpdate({ _id: req.body.id }, {
          nome: req.body.nome.toUpperCase(),
          telefone: req.body.telefone,      
          endereco: req.body.endereco.toUpperCase(),
          cpf: req.body.cpf 
        }).then(() => {
          req.flash("success_msg", "Pessoa editada com sucesso")
          res.redirect('/new')      
        }).catch((err) => {
          req.flash("Houve um erro ao editar a pessoa");
          res.redirect('/new') 
        });
      }
    }
});


router.post('/pesquisa', function(req, res, next) {
  //se não tiver recebido id, pesquisa todos
  if((!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) && (!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) 
    && (!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null) && (!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null)
  ){
      //TRAZ A LISTA DE PESSOAS NO DB    
      Pessoa.find().sort({criado_em: 'desc'}).lean().then( (pessoas) => {
        res.render('new', { title: 'Terroir', pessoas: pessoas});
      }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as pessoas")
        res.redirect('/new');
      })
    
  }
  else{
    //TRAZ A LISTA DE PESSOAS QUE SATISFAZ OS FILTROS
    Pessoa.find({ nome: {$regex: req.body.nome, $options: 'i'}}).sort({criado_em: 'desc'}).lean().then( (pessoas) => {
      console.log('puxou: '+ pessoas)
      res.render('new', { title: 'Terroir', pessoas: pessoas});      
    }).catch((err)=>{
      req.flash("error_msg", "Nenhnum resultado confere com os filtros")
      res.redirect('/new');
    })
  }
});


//EDITA UMA PESSOA NO DB
//seleciona
router.get('/editar/:id', function(req, res, next) {
  Pessoa.findOne({_id: req.params.id}).lean().then((pessoa) => {
    res.render('new', {pessoa: pessoa})
  }).catch((err)=>{
    req.flash("error_msg", "Houve uma falha no sistema")
    res.redirect('/new')
  })
  
});


//DELETA UMA PESSOA NO DB
router.post('/deletar', (req, res, next) => {
  Pessoa.findOneAndDelete({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Pessoa deletada com sucesso")
    res.redirect('/new')     
  }).catch((err) => {
    req.flash("Houve um erro ao deletar a pessoa");
    res.redirect('/new')
  });
});


module.exports = router;