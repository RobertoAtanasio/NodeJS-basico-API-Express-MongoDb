const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// o parâmetro 'select:' faz com que a senha não seja retornada quando de uma pesquisa 

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, select: false},
    created: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    let user =this;
    if (!user.isModified('password')) return next();
    
    user.password = await bcrypt.hash(user.password, 10);
    return next();
});

// como se vai utilizar o this dentro da função, se usar a arrow function dará erro!

// userSchema.pre('save', function(next) {
//     let user = this;
//     if (!user.isModified('password')) return next();    // se não alterou a senha, returna

//     bcrypt.hash(user.password, 10, (err, encrypted) => {
//         user.password = encrypted;
//         return next();
//     });
// });

module.exports = mongoose.model('User', userSchema);