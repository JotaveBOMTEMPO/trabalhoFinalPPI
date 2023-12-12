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

    if (!(data_b.nome && data_b.data && data_b.usuario)) {
        return res.render('form', {
            title: 'Cadastro',
            nome: data_b.nome,
            data: data_b.data,
            usuario: data_b.usuario,
            errorMsg: 'Todos os campos são obrigatórios.',
        });
    } else {
        const usu = {
            nome: data_b.nome,
            data: data_b.data,
            usuario: data_b.usuario,
        }

        listagem_USER_.push(usu);

        return res.render('usuariosCadastrados', {
            title: 'Usuários Cadastrados',
            usuarios: listagem_USER_,
        });
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
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), './PROGRAMACAO PARA INTERNET')));

app.set('views', path.join(process.cwd(), './PROGRAMACAO PARA INTERNET/views'));
app.set('view engine', 'ejs');

app.get('/', CHECK, (req, res) => {
    const ult_ACS = req.cookies.ult_ACS;
    const data = new Date();
    res.cookie("ult_ACS", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true    
    });
    return res.render('menu', { ult_ACS });
});

app.get('/form.html', CHECK, (req, res) => {
    res.render('form', { title: 'Cadastro' });
});

app.post('/form.html', CHECK, usuario_CadastroCHECK);

app.post('/telaLogin', (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario && senha && usuario === 'João' && senha === '2302') {
        req.session.checkUSER = true;
        res.redirect('/');
    } else {
        res.render('loginError', { title: 'Erro no Login' });
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
