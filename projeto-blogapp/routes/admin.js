// Importações
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
require("../models/Postagem")
const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

// Rota principal
router.get("/", eAdmin, (req, res) => {
    res.render("admin/index");
});

// Rota de categorias
router.get("/categorias", eAdmin, (req, res) => {
    // Listagem por ID de categorias em ordem decrescente
    Categoria.find().lean().sort({_id: "desc"}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias});
    })
    // Caso a listagem não seja bem-sucedida
    .catch((err) => {
        console.error(err)
        // Texto inserido na variável global "error_msg"
        req.flash("error_msg", "Erro ao listar categorias!")
        res.redirect("/admin")
    })
});

// Rota de adição de categorias
router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
});

// Rota que valida a adição de categorias
router.post("/categorias/nova", eAdmin, (req, res) => {
    // Array que vai guardar erros cometidos
    let erros = []

    // Verifica o campo "Nome da categoria"
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    // Verifica o campo "Slug da categoria"
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    // Confere o tamanho do texto digitado no campo "Nome da categoria"
    if(req.body.nome.length < 2){
        erros.push({texto: "O nome da categoria é muito pequeno"})
    }

    // Confere se foi cometido algum erro
    if(erros.length > 0){
        // Renderiza a view "addcategorias" com um objeto de erros
        res.render("admin/addcategorias", {erros: erros})
    } else{
        // Caso não tenha ocorrido erro algum, a categoria é adicionada ao banco de dados
        new Categoria({
            nome: req.body.nome,
            slug: req.body.slug
        }).save().then(() => {
            // Texto inserido na variável global "success_msg"
            req.flash("success_msg", "Categoria adicionada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            console.log(err);
            // Texto inserido na variável global "error_msg"
            req.flash("error_msg", "Houve um erro ao adicionar uma categoria. Tente novamente!")
            res.redirect("/admin/categorias")
        });
    }
});

// Rota de edição de categorias
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    // Busca um registro que possua o ID da URL
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        // Renderiza a view "editcategorias" com um objeto contendo o registro do ID
        res.render("admin/editcategorias", {categoria: categoria})
    })
    .catch((err) => {
        console.log(err)
        // Texto inserido na variável global "error_msg"
        req.flash("error_msg", "Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
})

// Rota que valida a edição da categoria
router.post("/categorias/edit", eAdmin, (req, res) => {
    // Array que vai guardar erros cometidos
    let erros = []

    // Verifica o campo "Nome da categoria"
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    // Verifica o campo "Slug da categoria"
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    // Confere o tamanho do texto digitado no campo "Nome da categoria"
    if(req.body.nome.length < 2){
        erros.push({texto: "O nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/editcategorias", {erros: erros})
    } else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            })
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Houve um erro ao editar uma categoria. Tente novamente!")
            res.redirect("/admin/categorias")
        });
    }
})

router.post("/categorias/delete", eAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})

// Rota de postagens
router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().lean().populate("categoria").sort({_id: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens});
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro o listar as postagens!")
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário!")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Título inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Insira o conteúdo"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida. Registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    } else{
        new Postagem({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }).save().then(() => {
            req.flash("success_msg", "Postagem enviada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Houve um erro ao enviar a postagem. Tente novamente!")
            res.redirect("/admin/postagens")
        });
    }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro ao listar categorias")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })
    
})

router.post("/postagens/edit", eAdmin, (req, res) => {
    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Título inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Insira o conteúdo"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida. Registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/editpostagens", {erros: erros})
    } else{
        Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug,
            postagem.descricao = req.body.descricao,
            postagem.conteudo = req.body.conteudo,
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Houve um erro ao salvar a postagem")
            })
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Houve um erro ao editar a postagem. Tente novamente!")
            res.redirect("/admin/postagens")
        });
    }
})

router.post("/postagens/delete", eAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem apagada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        console.error(err)
        req.flash("error_msg", "Houve um erro ao deletar a postagem! Tente novamente.")
        res.redirect("/admin/postagens")
    })
})

module.exports = router;