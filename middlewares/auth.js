const jwt = require('jsonwebtoken');
const config = require('../config/config')

const auth = (req, res, next) => {
    const token_header = req.headers.auth;

    if (!token_header) return res.status(401).send({ error: 'Token não enviado!' });

    jwt.verify(token_header, config.jwt_password, (erro, decoded) => {
        if (erro) return res.status(401).send('Token inválido!');
        res.locals.auth_data = decoded;     // salvou os dados do usuário
        return next();
    });
};

module.exports = auth;