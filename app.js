// const express = require('express');
// const app = express();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');

const url = config.bd_string;
const options = { 
    reconnectTries: Number.MAX_VALUE, 
    reconnectInterval: 500, 
    poolSize: 5, 
    useNewUrlParser: true 
}

mongoose.connect(url, options);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connection.on( 'error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + erro);
});

mongoose.connection.on( 'disconnected', () => {
    console.log('Banco de dados desconectado');
});

mongoose.connection.on( 'connected', () => {
    console.log('Aplicação conectada ao Banco de Dados.');
});

// border-parser: é o responsável para converter em json o objeto body passado na url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRoute = require('./Routes/index');
const usersRoute = require('./Routes/users');

app.use('/', indexRoute);
app.use('/users', usersRoute);

app.listen(3000, () => {
    console.log('Backend executando...');
});

module.exports = app;