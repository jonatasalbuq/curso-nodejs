const mongoose = require("mongoose")

// Configs
    // Conexão Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://127.0.0.1/teste1").then(() => {
        console.log("Banco de dados conectado!")
    }).catch((err) => {
        console.log(err)
    })

// Model
    const UserSchema = mongoose.Schema({
        
        firstname: {
            type: String,
            require: true
        },
        surname: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        birthday: {
            type: Date,
            require: true
        },
        country: {
            type: String
        }

    })

// Collection
    const User = mongoose.model("usuarios", UserSchema)

    new User({
        firstname: "Jonatas",
        surname: "Meneses Albuquerque",
        email: "jonatas123@gmail.com",
        password: "12345678",
        birthday: "2003-12-28",
        country: "Brazil"
    }).save().then(() => {
        console.log("Usuário cadastrado com sucesso!")
    }).catch((err) => {
        console.log(`Erro ao registrar usuário.\n${err}`)
    })