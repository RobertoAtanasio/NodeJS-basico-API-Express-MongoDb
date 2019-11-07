const express = require('express');
const router = express.Router();
const Users = require('../model/user')
const Pessoas = require('../model/pessoa')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const config = require('../config/config');

// --- Geração do Token

const createWebToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_password, { expiresIn: config.jwt_expires});
};

// criar os endpoints
// router.get('/', (req, res) => {
//     Users.find( {}, (err, data) => {
//         if (err) return res.send({ erro: 'Erro na consulta ao usuários.'});
//         return res.send(data);
//     });
//     // return res.send({message: 'Tudo ok com o método GET da rota de usuários'});
// });

// o status 200 é o default, não precisa ser colocado!

router.get('/', auth, async (req, res) => {
    try {
        const users = await Users.find({});
        return res.status(200).send(users); 
    } catch (error) {
        return res.status(500).send({ erro: 'Erro na consulta ao usuários.'});
        // return res.send({ erro: 'Erro na consulta ao usuários.'});
    }
});

// router.post('/', (req, res) => {
//     return res.send({message: 'Tudo ok com o método POST da rota de usuários'});
// })

router.post('/create', auth, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send({ erro: 'Dados insuficientes.'});

    try {
        if (await Users.findOne({ email })) return res.send('Usuário já registrado.');
        const user = await Users.create(req.body);
        user.password = undefined;
        return res.status(201).send(user);
    } catch (error) {
        return res.status(500).send({ erro: 'Erro ao criar usuários.'});
    }
});

router.post('/newPessoa', auth, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send({ erro: 'Dados insuficientes.'});

    try {
        if (await Pessoas.findOne({ email })) return res.send('Usuário já registrado.');
        const pessoa = await Pessoas.create(req.body);
        pessoa.password = undefined;
        return res.status(201).send(pessoa);
    } catch (error) {
        return res.status(500).send({ erro: 'Erro ao criar usuários.'});
    }
});

// router.post('/create', (req, res) => {
//     // const obj = req.body;
//     // if (!obj.email || !obj.password)
//     const { email, password } = req.body;
//     if (!email || !password) return res.send({ erro: 'Dados insuficientes.'});

//     // Users.findOne({ email: email, (err, data) => {
//     Users.findOne({ email }, (err, data) => {
//         if (err) return res.send({ erro: 'Erro ao buscar usuário:.' });
//         if (data) return res.send({ erro: 'Usuário já registrado.' });
//         // Users.create({ email: email, password: password});
//         // Users.create({ email, password});
//         Users.create( req.body, (err, data) => {
//             if (err) return res.send({ erro: 'Erro ao criar usuário'});
//             data.password = undefined;
//             return res.send(data);
//         });
//     });
//     // return res.send({message: 'Usuário criado com sucesso!'});
// });

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ erro: 'Dados insuficientes.'});
    try {
        const user = await Users.findOne({email}).select('+password');
        if (!user) return res.status(400).send({ erro: 'Usuário/Senha inválidos'});

        const pass_ok = await bcrypt.compare(password, user.password);
        if (!pass_ok) return res.status(401).send({ erro: 'Erro ao autenticar usuário.'});

        user.password = undefined;
        return res.status(200).send({ user, token: createWebToken('user.id') });
        // return res.send(user);
    } catch (error) {
        return res.status(500).send({ erro: 'Erro ao autenticar usuário.'});
    }
});

// // no acesso abaixo, a senha deve ser retornada para a validação, pois na definição em model/user.js
// // foi incluído o parâmetro select: false para não retornar a senha.
// router.post('/auth', (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.send({ erro: 'Dados insuficientes.'});

//     Users.findOne({ email }, (err, data) => {
//         if (err) return res.send({ erro: 'Erro ao validar o usuário.'});
//         if (!data) return res.send({ erro: 'Erro ao validar Usuário/Senha!'});

//         bcrypt.compare(password, data.password, (err, same) => {
//             if (err) return res.send({ erro: 'Erro ao autenticar usuário.'});
//             if (!same) return res.send({ erro: 'Usuário/Senha inválido!'});
//             data.password = undefined;
//             return res.send(data);
//         });
//     }).select('+password');
// });

module.exports = router



/*
Código de Retorno Http:
200 - OK
201 - Created
202 - Accepted 
400 - Bad request
401 - Unauthorized -- AUTENTICAÇÃO, tem caráter temporário.
403 - Forbidden -- AUTORIZAÇÃO, tem caráter permanente.
404 - Not found.
500 - Internal server error
501 - Not implemented - a API não suporta essa funcionalidade
503 - Service Unavailable - a API executa essa operação, mas no momento está indisponível
*/