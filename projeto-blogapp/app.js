// Carregando módulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const mongoose = require("mongoose")
    const app = express()
    const path = require("path")
    const admin = require("./routes/admin")
    const usuarios = require("./routes/usuario")
    const session = require("express-session")
    const flash = require("connect-flash")
    const passport = require("passport")
    require("./config/auth")(passport)
    require("./models/Postagem")
    require("./models/Categoria")
    const Postagem = mongoose.model("postagens")
    const Categoria = mongoose.model("categorias")

// Configurações
    // Sessão
    app.use(session({
        secret: "cursonodejs",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })

    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine("handlebars", handlebars.engine({defaultLayout: "main"}))
    app.set("view engine", "handlebars")

    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://127.0.0.1/blogapp").then(() => {
        console.log("Conexão com banco de dados MongoDB estabelecida!");
    }).catch((err) => {
        console.log(`Erro ao se conectar com o banco de dados: ${err}`)
    })

    // Arquivos estáticos
    app.use(express.static(path.join(__dirname, "public")))
// Rotas
    app.get("/", (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().sort({_id: "desc"}).then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    console.log(err)
                    req.flash("error_msg", "")
                })
            } else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/categorias")
            }
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Não foi possível acessar as postagens desta categoria")
            res.redirect("/categorias")
        })
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            } else{
                req.flash("error_msg", "Postagem inexistente")
                res.redirect("/")
            }
        }).catch((err) => {
            console.log(err)
            req.flash("error-msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/404", (req, res) => {
        res.send("Erro 404!")
    })

    app.use("/admin", admin)
    app.use("/usuarios", usuarios)
// Outros
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log(`Aplicação rodando no http://localhost:${PORT}`)
    })