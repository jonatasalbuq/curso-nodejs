const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Post = require("./models/posts")
const path = require("path")

// Config
    // Template Engine
    app.engine("handlebars", handlebars.engine({defaultLayout: "main"}));
    app.set("view engine", "handlebars");

    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Arquivos Estáticos
    app.use(express.static(path.join(__dirname, "public")))

// Rotas
    app.get("/", (req, res) => {
        Post.findAll({order: [["id", "DESC"]]})
        .then((posts) => {
            const postData = posts.map(post => ({
                id: post.id,
                createdAt: post.createdAt,
                titulo: post.titulo,
                conteudo: post.conteudo
            }));
            res.render("home", { posts: postData });
        }); 
    });

    app.get("/cadastro", (req, res) => {
        res.render("formulario");
    });

    app.post("/add", (req, res) => {
        Post.create({
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        })
        .then(() => {
            res.redirect("/cadastro")
        })
    });

    app.get("/deletar/:id", (req, res) => {
        Post.destroy({where: {"id": req.params.id}})
        .then(() => {
            res.redirect("/")
        })
        .catch(() => {
            res.send("Postagem inexistente!")
        })
    })

app.listen(8080, () => {
    console.log("Servidor rodando na URL http://localhost:8080");
});