const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema do Usuário
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,  // O campo nome completo é obrigatório
  },
  username: {
    type: String,
    required: true,
    unique: true,  // Nome de usuário deve ser único
  },
  email: {
    type: String,
    required: true,
    unique: true,  // E-mail também deve ser único
  },
  password: {
    type: String,
    required: true,  // A senha é obrigatória
  },
  profilePicture: {
    type: String,
    default: '',  // Valor padrão para foto de perfil
  },
  bio: {
    type: String,
    default: '',  // Valor padrão para biografia
  },
});

// Criptografar senha antes de salvar no banco de dados
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      throw new Error('Erro ao comparar senhas');
    }
  };
  

// Criar o modelo de Usuário
const User = mongoose.model('User', userSchema);
module.exports = User;
