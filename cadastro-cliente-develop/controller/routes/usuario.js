const seguranca = require('../../model/components/seguranca')
const usuarioBanco = require('../../controller/SQL/usuarioBD')

module.exports = function (app){

    app.get("/", function(req, resp){
        resp.send("Bem-vindo ao meu app");
    });

    app.get('/usuario/Cadastro', function (req, res){
        if(req.query.fail) 
            res.render('usuario/CadastroUsuario', {mensagem: 'Cadastro'});
        else
            res.render('usuario/CadastroUsuario', {mensagem: null});

    });
    
    app.post('/cadastro/usuario/edit/salvar', (req, res) => {
        var usuario = {nome: req.body.nome,
                       senha: req.body.senha,
                       id: req.body.id};
        try {
            usuarioBanco.updateUsuario(usuario);
            res.render('usuario/Sucesso', {mensagem: 'alterado'});
        } catch (error){
            res.render('usuario/EditUsuario', {title: 'Edicção Cadastro', mensagem: "Erro no cadastro"})
        }
    });

    app.post('/cadastro/usuario/salvar', seguranca.autenticar, (req, res) => {
      try{ 
        var usuario = {nome: req.body.nome,
                       senha: seguranca.ocultarsenha(req.body.senha)}
            usuarioBanco.insertUsuario(usuario);
            res.render('usuario/Sucesso', {mensagem: 'cadastrado'});
        } catch (error){
            res.render('usuario/CadastroUsuario', {title: 'Cadastro',
            mensagem: "Erro no cadastro"});
        }
    });

    app.get('/lista/usuario',seguranca.autenticar, async (req, res, next) => {
        try{
            const docs = await usuarioBanco.selectUsuario();
            res.render('usuario/Lista', {mensagem: 'Lista de Usuários', docs });
        } catch(err){
            next(err);
        }
    }
    );

    app.get('/delete/usuario/id',seguranca.autenticar, async (req, res, next) => {
        try{
            var id = req.params.id;
            await usuarioBanco.deleteUsuario(id);
            const docs = await usuarioBanco.selectUsuario();
            res.render('usuario/Lista', {mensagem: 'Usuário excluído com sucesso', docs });
        } catch(err){
          next(err);
        }
    });

    app.get('/edit/usuario/id',seguranca.autenticar, async (req, res, next) => {
        try{
            var id = req.params.id;
            const usuario = await usuarioBanco.getUsuarioId(id);
            res.render('usuario/EditUsuario', {mensagem: ' ', usuario });
        } catch(err){
          next(err);
        }
    });

    app.get('/delete/usuario/id',seguranca.autenticar, async (req, res, next) => {
        try{
            var id = req.params.id;
            await usuarioBanco.deleteUsuario(id);
            const docs = await usuarioBanco.selectUsuario();
            res.render('usuario/Lista', {mensagem: 'Usuário excluído com sucesso', docs });
        } catch(err){
          next(err);
        }
    });

    app.get('/login', function (req, res){
        if(req.query.fail) 
            res.render('usuario/Login', {mensagemLogin: 'Usuário e/ou senha incorretos!'});
        else
            res.render('usuarioLogin', {mensagemLogin: null});

    })
}
