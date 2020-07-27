var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require("../models/Produto");

//leva para a pagina de produto
router.get('/', function(req, res, next) { 
  res.render('produto');
});

const Produto = mongoose.model("produtos");

//CRIA UMA PESSOA NO DB
router.post('/novo', function(req, res, next) {
  //array de erros da validação, é enviado caso seja maior que 0
  var erros = [];
    //validação do formulario
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
      erros.push({texto: "Descricao inválida"})
    };  

    if(erros.length > 0){
      res.render('produto', {erros: erros})
    }

    //se não deu erro => erros == 0
    else {
      //se não tiver recebido id, grava novo
      if(!req.body.id || typeof req.body.id == undefined || req.body.id == null){
        const novoProduto = {  
          descricao: req.body.descricao.toUpperCase(),
          informacoes: req.body.info,      
          ingredientes: req.body.ingredientes,
          valor: req.body.valor      
        }

        new Produto(novoProduto).save().then(() => {
          req.flash("success_msg", "Produto cadastrado com sucesso")
          res.redirect('/produto')      
        }).catch((err) => {
          req.flash("Houve um erro ao cadastrar o produto");
          res.redirect('/produto') 
        });
      }
      //se tiver recebido id, EDITA UMA PESSOA NO DB
      else{
        Produto.findOneAndUpdate({ _id: req.body.id }, {
          descricao: req.body.descricao.toUpperCase(),
          informacoes: req.body.info,      
          ingredientes: req.body.ingredientes,
          valor: req.body.valor 
        }).then(() => {
          req.flash("success_msg", "Produto editado com sucesso")
          res.redirect('/produto')      
        }).catch((err) => {
          req.flash("Houve um erro ao editar o produto");
          res.redirect('/produto') 
        });
      }
    }
});


router.post('/pesquisa', function(req, res, next) {
  //se não tiver recebido id, pesquisa todos
  if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
      //TRAZ A LISTA DE PESSOAS NO DB    
      Produto.find().sort({criado_em: 'desc'}).lean().then( (produtos) => {
        res.render('produto', { produtos: produtos});
      }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar os produtos")
        res.redirect('/produto');
      })
    
  }
  else{
    //TRAZ A LISTA DE PESSOAS QUE SATISFAZ OS FILTROS
    Produto.find({ descricao: {$regex: req.body.descricao, $options: 'i'}}).sort({criado_em: 'desc'}).lean().then( (produtos) => {
      res.render('produto', { produtos: produtos});      
    }).catch((err)=>{
      req.flash("error_msg", "Nenhum resultado confere com os filtros")
      res.redirect('/produto');
    })
  }
});


//EDITA UMA PESSOA NO DB
//seleciona
router.get('/editar/:id', function(req, res, next) {
  Produto.findOne({_id: req.params.id}).lean().then((produto) => {
    res.render('produto', {produto: produto})
  }).catch((err)=>{
    req.flash("error_msg", "Houve uma falha no sistema")
    res.redirect('/produto')
  })
  
});


//DELETA UMA PESSOA NO DB
router.post('/deletar', (req, res, next) => {
  Produto.findOneAndDelete({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Produto deletado com sucesso")
    res.redirect('/produto')     
  }).catch((err) => {
    req.flash("Houve um erro ao deletar o produto");
    res.redirect('/produto')
  });
});


module.exports = router;

