const mongoose = require("mongoose")

const PostagemSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", PostagemSchema);