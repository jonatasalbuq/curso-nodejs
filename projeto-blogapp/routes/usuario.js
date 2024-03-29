const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const passport = require("passport")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha.length < 8){
        erros.push({texto: "Senha inválida. Forneça uma senha com pelo menos 8 caracteres"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não se correspondem. Certifique-se de digitar a mesma senha"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    } else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Email já registrado no sistema")
                res.redirect("/usuarios/registro")
            } else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(err){
                            req.flash("error_msg", "Houve um erro durante a criação do novo usuário")
                            res.redirect("/")
                        } 

                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso")
                            res.redirect("/")
                        }).catch((err) => {
                            console.log(err)
                            req.flash("error_msg", "Houve um erro ao criar um novo usuário. Tente novamente")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    // Método utilizado sempre para autenticar algo, no caso, estratégia local 
    passport.authenticate("local", {
        // Se a autenticação ocorrer, será redirecionado para a rota "/"
        successRedirect: "/",
        // Se a autenticação falhar, será redirecionado para a rota "/usuarios/login"
        failureRedirect: "/usuarios/login",
        // Habilita as mensagens flash
        failureFlash: true
        // Feito isso, passe novamente o "req", "res" e "next"
    })(req, res, next)
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        res.redirect("/")
      })
})

module.exports = router