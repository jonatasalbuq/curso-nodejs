const mongoose = require("mongoose");

const CategoriaSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("categorias", CategoriaSchema);