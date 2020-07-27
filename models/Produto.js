const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const produtoSchema = new Schema({
    descricao: {
        type: String,
        require: true
    },
    informacoes: {
        type: String
    },
    ingredientes:{
        type: String        
    },
    valor: {
        type: Number
    },
    criado_em:{
        type: Date,
        default: Date.now()
    }
});


mongoose.model('produtos', produtoSchema);