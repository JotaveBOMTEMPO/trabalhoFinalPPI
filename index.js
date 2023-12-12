import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
const door = 3000;
const host = '0.0.0.0';
const listagem_USER_ = [];
const chat_MSG = [];

function usuario_CadastroCHECK(req, res) {
    const data_b = req.body;
    let resp = '';
    if (!(data_b.nome && data_b.data && data_b.usuario )) {
        resp = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="form.css">
            <title>Cadastro</title>
        </head>
        <body>
            <div id="registration-box">
                <form action="/form.html" method="POST">
        
                    <h3>CADASTRO</h3>
                    <label class="label" for="full-name">Nome:</label>
                    <input type="text" id="full-name" name="full-name" placeholder="Insira o nome" value="${data_b.nome}" required>
        `;
        if (!data_b.nome) {
            resp += `
                    <p class="rockDanger">O campo Nome é obrigatório</p>
            `;
        }

        resp += `
                    <label class="label" for="birth-date">Data de Nascimento:</label>
                        <input type="text" id="birth-date" name="birth-date" placeholder="Insira a Data de Nascimento" value="${data_b.data}" required>
        `;
        if (!data_b.data) {
            resp += `
                    <p class="rockDanger">O campo Data de Nascimento é obrigatório</p>
            `;
        }
        
        resp += `
                    <label class="label" for="username">Nickname ou Usuario:</label>
                        <input type="text" id="username" name="username" placeholder="Insira o nome de usuário" value="${data_b.usuario}" required>
        `;   
        if (!data_b.usuario) {
            resp += `
                    <p class="rockDanger">O campo Nome de Usuário é obrigatório</p>
            `;
        }
        
        resp += `
                    <br>
                    <button id="register-btn" type="submit">Cadastrar</button>
    
                </form>
            </div>
        </body>
        </html>
        `;
        
        return res.end(resp);

    } else {
        const usu = {
            nome: data_b.nome,
            data: data_b.data,
            usuario: data_b.usuario,
        }

        listagem_USER_.push(usu);

        resp = `
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Usuário</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
            <h1>Usuários Cadastrados</h1>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de aniversario</th>
                        <th>Nome de Usuário</th>
                    </tr>
                </thead>
                <tbody>`;
        
        for (const usu of listagem_USER_) {
            resp += `
                <tr>
                    <td>${usu.nome}</td>
                    <td>${usu.data}</td>
                    <td>${usu.usuario}</td>
                </tr>
                    `;
        }

        resp += `
                </tbody>
            </table>
            <a class="btn btn-primary" href="/menu.html" role="button">Voltar ao Menu</a>
            <a class="btn btn-outline-info" href="/form.html" role="button">Acessar Cadastro</a>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>    
            </body>
            </html>
                `;

        return res.end(resp);

    }
}

function CHECK(req, res, next) {
    if (req.session.checkUSER) {
        next();
    } else {
        res.redirect("/telaLogin.html");
    }
}

const app = express();
app.use(cookieParser());

app.use(session({
    secret: "myscrtpsswrd",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30,
    }
}))

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), './PROGRAMACAO PARA INTERNET')));

app.get('/', CHECK, (req, res) => {
    const ult_ACS = req.cookies.ult_ACS;
    const data = new Date();
    res.cookie("ult_ACS", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true    
    });
    return res.end(`
        <!DOCTYPE html>
            <head>
                <meta charset="UTF-8>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="menu.css">
                <title>Menu do sistema</title>
            </head>
            <body>
                <h1>Menu</h1>
                <a href="/chat.html">Chat</a>
                <a href="/form.html">Novo Usuario</a>
            </body>
            <footer>
                <p>Último Acesso de Usuário: ${ult_ACS}</p>
            </footer>
        </html>        
    `)
});
app.get('/form.html', CHECK, (req, res) => {
    res.sendFile(path.join(process.cwd(), './PROGRAMAÇÃO PARA INTERNET/form.html'));
});
app.post('/form.html', CHECK, usuario_CadastroCHECK);

app.post('/telaLogin', (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    console.log("Usuario:", usuario, "Senha:", senha); 

    if (usuario && senha && usuario === 'João' && senha === '2302') {
        req.session.checkUSER = true;
        res.redirect('/');
    } else {
        console.log("Usuário e(ou) senha incorretos"); 
        res.end(`
            <!DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <title>Ocorreu uma Falha no Login de Usuário</title>
                    <link rel="stylesheet" type="text/css" href="loginError.css">
                </head>
                <body>
                    <h1>Usuario e(ou) senha inválidos</h1>
                    <a href="/telaLogin.html">Tentar Novamente</a>
                </body> 
        `)
    }
});

app.get('/get-usuarios', (req, res) => {
    res.json({ usuarios: listagem_USER_ });
});

function temp_current() {
    return new Date().toLocaleString();
}

app.post('/enviar-mensagem', CHECK, (req, res) => {
    const usuario = req.body.usuario;
    const mensagem = req.body.mensagem;

    if (usuario && mensagem) {
        const data_att = temp_current();
        const msg = { usuario, mensagem, data_att };
        chat_MSG.push(msg);
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, error: 'Usuário e mensagem são obrigatórios' });
    }
});

app.get('/get-mensagens', CHECK, (req, res) => {
    res.json(chat_MSG);
});


app.listen(door, host, () => {
    console.log(`Servidor rodando na url http://localhost:3000`);
});