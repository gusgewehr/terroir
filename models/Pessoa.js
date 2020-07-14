const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pessoaSchema = new Schema({
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
    },
    criado_em:{
        type: Date,
        default: Date.now()
    }
});


mongoose.model('pessoas', pessoaSchema);