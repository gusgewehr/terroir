const mongoose = require("mongoose");

//configurando o mongoose
mongoose.connect("mongodb://localhost/terroir", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Conectado");
}).catch((err) => {
    console.log("Houve um erro ao se conectador ao mongoDB: " + err);
});

//Definindo Model - pessoas

const pessoaSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    telefone: {
        type: String
    },
    endereco:{
        type: String,
        require: true
    },
    cpf: {
        type: String
    }
});
mongoose.model('pessoas', pessoaSchema);

//referencia schema na variavel
var novaPessoa = mongoose.model('pessoas');

new novaPessoa({
    nome: "",
    telefone: "",
    endereco: "",
    cpf: "",
}).save().then(() => {
    console.log("Pessoa cadastrada com sucesso")
}).catch((err)=>{
    console.log("Falha ao cadastrar pessoa. Erro: " + err)
})