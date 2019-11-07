const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, select: false},
    created: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    let pessoa = this;
    if (!pessoa.isModified('password')) return next();
    
    pessoa.password = await bcrypt.hash(pessoa.password, 10);
    return next();
});

module.exports = mongoose.model('Pessoa', userSchema);