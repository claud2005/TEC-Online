const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definindo o esquema para o usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
  // Verifica se a senha foi modificada ou é nova, se não, não faz nada
  if (!this.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10); // Gerando o salt
    this.password = await bcrypt.hash(this.password, salt); // Criptografando a senha
    next();
  } catch (err) {
    next(err); // Caso haja um erro no processo de criptografia
  }
});

// Comparar senhas
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Comparando as senhas
  } catch (err) {
    throw new Error('Erro ao comparar as senhas');
  }
};

// Criando o modelo de usuário a partir do esquema
const User = mongoose.model('User', userSchema);

module.exports = User;
