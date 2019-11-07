const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// criar os endpoints

router.get('/', auth, (req, res) => {
    // mostrar os dados salvos em auth.js
    // Aqui se pode colocar regras de negócios sobre o usuário (via seu Id)
    console.log(res.locals.auth_data); 
    return res.send({message: 'essa informação é muito importante. Usuários não autorizados não deveriam recebê-la!'})
})

router.post('/', auth, (req, res) => {
    return res.send({message: '`Tudo ok com o método POST da raiz'})
})

module.exports = router

